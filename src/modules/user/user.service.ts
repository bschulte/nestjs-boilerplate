import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import moment from 'moment';
import * as randToken from 'rand-token';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as owasp from 'owasp-password-strength-test';

import { BaseService } from 'src/base.service';
import { generateRandomStr } from 'src/shared/util';
import { User } from './user.entity';
import { LoginRecord } from './loginRecord.entity';
import { BackendLogger } from 'src/modules/logger/BackendLogger';
import { DotenvService } from 'src/modules/dotenv/dotenv.service';
import { UserConfigService } from 'src/modules/userConfig/userConfig.service';
import { UserAccessService } from 'src/modules/userAccess/userAccess.service';
import { EmailService } from 'src/modules/email/email.service';
import { AuditService } from 'src/modules/audit/audit.service';
import { GroupUserAccessService } from '../groupUserAccess/groupUserAccess.service';

@Injectable()
export class UserService extends BaseService<User> {
  private readonly logger = new BackendLogger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(LoginRecord)
    private readonly loginRecordRepo: Repository<LoginRecord>,
    private readonly dotenvService: DotenvService,
    private readonly userConfigService: UserConfigService,
    private readonly userAccessService: UserAccessService,
    private readonly auditService: AuditService,
    private readonly emailService: EmailService,
    private readonly groupUserAccess: GroupUserAccessService,
  ) {
    super(userRepo);
  }

  public async login(email: string, password: string, token: string) {
    const user = await this.findOneWithPassword(email);

    if (user) {
      this.logger.silly(`Attempting to login user: ${user.email}`);
      // Check if the account is locked
      if (user.locked) {
        this.logger.warn('User tried to log into locked account');
        throw new UnauthorizedException(
          'This account is locked, please contact the system administrator for assistance.',
        );
      }

      // Verify the password
      if (bcrypt.compareSync(password, user.password)) {
        // Password correct, create JWT token
        const jwtToken = jwt.sign(
          { email: user.email },
          this.dotenvService.get('APP_KEY'),
          {
            expiresIn: '12h',
          },
        );

        await this.update(
          { id: user.id },
          { lastLogin: new Date(), loginAttempts: 0 },
        );

        await this.auditService.create({ userId: user.id, type: 'Login' });
        return { token: jwtToken };
      } else {
        // Invalid password given, add the bad login attempt to the database
        await this.update(
          { id: user.id },
          { loginAttempts: user.loginAttempts + 1 },
        );
        this.logger.warn('Invalid password attempt');

        if (user.loginAttempts >= 5) {
          await this.update({ id: user.id }, { locked: true });
          this.logger.error('Account now locked from too many login attempts');

          return {
            msg:
              'Account is locked due to too many login attempts, please contact system administrator for assistance.',
          };
        } else {
          throw new UnauthorizedException(
            'Invalid email and/or password. Upon 5 incorrect logins the account will be locked.',
          );
        }
      }
    } else {
      this.logger.error(`Login attempt unsuccessful, user not found: ${email}`);
      throw new UnauthorizedException(
        'Invalid email and/or password. Upon 5 incorrect logins the account will be locked.',
      );
    }
  }

  public async createUser(email: string) {
    // Create random password
    const password = generateRandomStr(24);
    // Create API key
    const apiKey = generateRandomStr(36);

    this.logger.debug(`Creating new user: ${email}`);

    const passHash = bcrypt.hashSync(password, 10);

    const newUser = this.userRepo.create({
      email,
      password: passHash,
      apiKey,
      subGroups: [],
      locked: false,
      loginAttempts: 0,
    });
    await this.userRepo.save(newUser);

    if (!newUser) {
      return { successfullyCreatedUser: false };
    }

    this.logger.silly(`User entered into DB: ${newUser.email}`);

    // Create the default access values for the user
    await this.userAccessService.create({ userId: newUser.id });

    // Create default config
    await this.userConfigService.create({ userId: newUser.id });

    // Create default group user access
    await this.groupUserAccess.create({ userId: newUser.id });

    return { successfullyCreatedUser: true, generatedPassword: password };
  }

  public async changePassword(
    email: string,
    currentPass: string,
    newPass: string,
  ) {
    const user = await this.findOneWithPassword(email);

    if (bcrypt.compareSync(currentPass, user.password)) {
      // Check for password minimums
      const passTestResult = owasp.test(newPass);
      if (!passTestResult.strong) {
        this.logger.error(
          `Invalid new password entered: ${user.email}, errors: ${passTestResult.errors}`,
        );
        throw new BadRequestException(
          `Invalid new password: ${passTestResult.errors}`,
        );
      }

      // If the user provided the correct password, and their new password meets the
      // minimum requirements, update their user record with the new password
      await this.update(
        { id: user.id },
        {
          password: bcrypt.hashSync(newPass, 10),
          needsPasswordChange: false,
        },
      );

      await this.auditService.create({
        userId: user.id,
        type: 'Change Password',
      });
      return { success: true };
    } else {
      this.logger.warn('Incorrect password given during password change');

      throw new BadRequestException('Incorrect password');
    }
  }

  public async generatePasswordResetToken(emailAddress: string) {
    const user = await this.findOne({ email: emailAddress });

    if (!user) {
      this.logger.warn(
        `Forgotten password request - Could not find user: ${emailAddress}`,
      );
      // We want to return status of 200 to not let the client know if
      // the email exists or not
      return;
    }

    // Generate the random reset token
    const token = randToken.generate(32);

    // Set the user database entry with the token and the expiration date-time
    await this.update(
      { id: user.id },
      {
        resetToken: token,
        resetTokenExpires: moment()
          .add(4, 'hours')
          .toDate(),
      },
    );

    // Send the user reset email
    await this.emailService.sendEmail({
      templateName: 'passwordReset',
      templateParams: [token],
      subject: '[INSERT TITLE HERE] Password Reset',
      isInternal: false,
      userEmail: emailAddress,
      title: 'Password Reset',
    });

    return;
  }

  // Handles a forgotten password reset request
  public async resetPassword(
    token: string,
    newPassword: string,
    newPasswordDuplicate: string,
  ) {
    this.logger.silly('Resetting password for user');
    // Find the user with the associated token
    const user = await this.findOne({ resetToken: token });

    if (!user) {
      this.logger.error(`Could not find user with given token: ${token}`);
      throw new BadRequestException('Invalid token');
    }

    // Check if the token is still valid
    const timeDiff = moment
      .utc(user.resetTokenExpires)
      .local()
      .diff(moment(), 'seconds');
    if (timeDiff < 0) {
      this.logger.error(
        `Expired token for password reset used: ${token}, expired datetime: ${moment(
          user.resetTokenExpires,
        ).format('L - LTS')}`,
      );
      throw new BadRequestException('Invalid token');
    }

    // Check if the passwords match
    if (newPassword !== newPasswordDuplicate) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check new password strength
    const passTestResult = owasp.test(newPassword);
    if (!passTestResult.strong) {
      this.logger.error(
        `Invalid new password entered: ${user.email}, errors: ${passTestResult.errors}`,
      );
      throw new BadRequestException(
        `Invalid new password. Errors: ${passTestResult.errors}`,
      );
    }

    // Update the user's password
    // Also remove the reset token and the token's expiration date
    await this.update(
      { id: user.id },
      {
        password: bcrypt.hashSync(newPassword, 10),
        resetToken: null,
        resetTokenExpires: null,
      },
    );

    await this.emailService.sendEmail({
      templateName: 'passwordChangeNotification',
      templateParams: [],
      userEmail: user.email,
      subject: 'Kryptowire EMM Portal - Password Reset',
      isInternal: false,
      title: 'Password Change',
    });

    return { success: true };
  }

  public async getLoginActivity(user: User) {
    return this.loginRecordRepo.find({ userId: user.id });
  }

  // Delete a user
  public async deleteUser(userId: string) {
    await this.delete({ id: userId });
    await this.userConfigService.delete({ userId });
    await this.userAccessService.delete({ userId });

    this.logger.silly(`Deleted user, id: ${userId}`);
    return true;
  }

  public async createLoginRecord({
    req,
    user,
    country,
    region,
    city,
    lat,
    long,
  }: any) {
    const loginRecord = this.loginRecordRepo.create({
      loginTime: new Date(),
      ip: req.ip,
      userId: user.id,
      country,
      region,
      city,
      lat,
      long,
    });

    return this.loginRecordRepo.save(loginRecord);
  }

  public async findGroupIds(group: string) {
    const users = await this.userRepo.find({ group });
    return users.map(user => user.id);
  }

  public async findSubGroupIds(group: string, subGroups: string[]) {
    const users = await this.userRepo.find({ group });
    return (
      users
        // Filter the user ids by matching any of the given user's sub groups
        .filter(user =>
          // Returns true if there is at least *one* match between the sets of sub groups
          user.subGroups.some(subGroup => subGroups.includes(subGroup)),
        )
        .map(user => user.id)
    );
  }

  public async findGroupUsers(group: string) {
    return this.userRepo
      .createQueryBuilder('users')
      .select([
        'users.id',
        'users.email',
        'users.sub_groups',
        'users.locked',
        'users.last_login',
        'access.can_submit',
        'access.can_view_reports',
      ])
      .leftJoin('users.access', 'access')
      .where('users.group = :group', { group })
      .getMany();
  }

  public async findUserRiskProfileInfo(userId: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.riskProfile', 'riskProfile')
      .leftJoinAndSelect('riskProfile.riskProfileItems', 'riskProfileItems')
      .leftJoinAndSelect('riskProfileItems.reportItem', 'reportItem')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  public async findAllUserLoginActivity(userId: string) {
    return this.loginRecordRepo
      .createQueryBuilder('loginRecord')
      .where('loginRecord.userId = :userId', { userId })
      .andWhere(
        new Brackets(qb => {
          qb.where('loginRecord.ip NOT LIKE :str', {
            str: '192.168.%',
          }).andWhere('loginRecord.ip NOT LIKE :str', { str: '::%' });
        }),
      )
      .orderBy('loginRecord.id', 'DESC')
      .take(200)
      .getMany();
  }

  public async findOneWithPassword(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }
}
