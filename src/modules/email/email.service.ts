import { Injectable, OnModuleInit } from '@nestjs/common';
import { join } from 'path';
import * as mailer from 'nodemailer';
import * as fs from 'fs';

import { BackendLogger } from '../logger/BackendLogger';
import Mail = require('nodemailer/lib/mailer');
import { DotenvService } from 'src/modules/dotenv/dotenv.service';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new BackendLogger(EmailService.name);

  private transporter: Mail;

  private emailTemplates = {
    passwordReset: token => {
      return `
      A password reset has been requested for your user account. Please use <a href="insert_link_here">this link</a> to reset your password.
        <br /><br />
      The link will remain valid for 4 hours.
        <br /><br />
      If you did not request this password reset, please contact support.
    `;
    },

    passwordChangeNotification: () => {
      return `
      Your password has successfully been changed.
        <br /><br />
      If you did not request this password change, please contact support.
    `;
    },

    portalErrorEmail: (user, errorType, error, info) => {
      return `
      Error in portal: ${errorType}
      <br/><br/>
      Error:<br />
      ${JSON.stringify(error, null, 2)}<br />

      Info:<br />
      ${JSON.stringify(info, null, 2)}<br />
      <br />
      User:<br />
      ${user.email}, id: ${user.id}<br />
    `;
    },

    emailNewUser: password => {
      return `
    An account has been created for you on the <a href="insert_link_here">INSERT NAME HERE</a> <br/>
    <br/>
    Your password is:<br/>
    <br/>
    ${password}<br/>
    <br/>
    After logging in you'll be prompted to change this password.<br/>
`;
    },
  };

  constructor(private readonly dotenvService: DotenvService) {}

  public async sendEmail({
    subject,
    templateName,
    templateParams,
    userEmail,
    isInternal,
    title = '',
  }: {
    subject: string;
    templateName: string;
    templateParams: any[];
    userEmail?: string;
    isInternal: boolean;
    title: string;
  }) {
    const emails = await this.getInternalEmailAlertAddresses();
    const text = this.emailTemplates[templateName](...templateParams);

    let html = fs.readFileSync(
      join(__dirname, './emailAssets/email-template.html'),
      'utf-8',
    );
    html = html.replace('{{title}}', title);
    html = html.replace('{{text}}', text);

    // Check to see if the user has a @kryptowire address
    // If so, don't send the alert email, since it's likely a placeholder
    // address used by the user instead of their actual email
    if (
      !isInternal &&
      userEmail.endsWith('@kryptowire.com') &&
      templateName !== 'passwordReset'
    ) {
      return true;
    }

    try {
      const mailOptions = {
        from: 'robot@kryptowire.com',
        to: isInternal ? emails : userEmail,
        bcc: isInternal ? [] : emails,
        subject,
        html,
        text,
        attachments: [
          {
            filename: 'kryptowire.png',
            path: join(__dirname, 'emailAssets', 'kryptowire.png'),
            cid: 'kryptowire_email_logo',
          },
        ],
      };

      const emailResult = await this.transporter.sendMail(mailOptions);
      this.logger.silly(
        `${templateName} email sent, response: ${JSON.stringify(emailResult)}`,
      );
      this.printTestEmailLink(emailResult);
    } catch (err) {
      this.logger.warn(`Error sending ${templateName} email: ${err}`);
      return false;
    }
    return true;
  }

  public onModuleInit() {
    this.logger.silly(`Email module initialized`);
    if (process.env.NODE_ENV === 'development') {
      this.logger.silly('Creating test email account');
      mailer.createTestAccount((err, account) => {
        if (err) {
          this.logger.error(`Error creating test account: ${err}`);
          return;
        }
        this.logger.debug(`Test email account user: ${account.user}`);
        this.transporter = mailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });
      });
    } else {
      this.logger.silly('Creating standard gmail email account');
      this.transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.dotenvService.get('ROBOT_EMAIL_USERNAME'),
          pass: this.dotenvService.get('ROBOT_EMAIL_PASSWORD'),
        },
      });
    }
  }

  private printTestEmailLink(emailResult: any) {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(
        `Test email URL: ${mailer.getTestMessageUrl(emailResult)}`,
      );
    }
  }

  private async getInternalEmailAlertAddresses() {
    // Get the internal email addresses to alert Kryptowire about the app completion
    const addresses = this.dotenvService.get('INTERNAL_EMAIL_ADDRESSES');

    this.logger.silly(
      `Internal email addresses to email to: ${JSON.stringify(addresses)}`,
    );
    return addresses.split(',');
  }
}
