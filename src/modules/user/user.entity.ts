import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToOne,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { NotificationStatus } from 'src/modules/notification/notificationStatus.entity';
import { UserAccess } from 'src/modules/userAccess/userAccess.entity';
import { Audit } from '../audit/audit.entity';
import { LoginRecord } from './loginRecord.entity';
import { UserConfig } from '../userConfig/userConfig.entity';
import { ObjectType, Field } from 'type-graphql';
import { GroupUserAccess } from '../groupUserAccess/groupUserAccess.entity';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  public id: string;

  @Column()
  @Field()
  public email: string;

  @Column({ select: false })
  public password: string;

  @CreateDateColumn()
  @Field()
  public createdAt: Date;

  @Column({ nullable: true })
  @Field()
  public lastLogin: Date;

  @UpdateDateColumn()
  @Field()
  public updatedAt: Date;

  @Column({ default: '' })
  @Field()
  public group: string;

  @Column('simple-json', { default: '[]' })
  @Field(type => [String])
  public subGroups: string[];

  @Column()
  @Field()
  public apiKey: string;

  @Column({ default: 0 })
  @Field()
  public loginAttempts: number;

  @Column({ default: false })
  @Field()
  public locked: boolean;

  @Column({ default: 0 })
  @Field()
  public defaultPriority: number;

  @Column({ nullable: true })
  @Field()
  public resetToken: string;

  @Column({ nullable: true })
  public resetTokenExpires: Date;

  @Column({ default: false })
  public isAdmin: boolean;

  @Column({ default: false })
  @Field()
  public needsPasswordChange: boolean;

  @OneToMany(
    type => NotificationStatus,
    notificationStatus => notificationStatus.user,
  )
  public notifications: NotificationStatus[];

  @OneToOne(
    type => UserAccess,
    userAccess => userAccess.user,
  )
  @Field(type => UserAccess)
  public access: UserAccess;

  @OneToOne(
    type => GroupUserAccess,
    groupUserAccess => groupUserAccess.user,
  )
  @Field(type => GroupUserAccess)
  public groupUserAccess: GroupUserAccess;

  @OneToOne(
    type => UserConfig,
    userConfig => userConfig.user,
    { eager: true },
  )
  @Field(type => UserConfig)
  public config: UserConfig;

  @OneToMany(
    type => Audit,
    audit => audit.user,
  )
  public auditEntries: Audit[];

  @OneToMany(
    type => LoginRecord,
    loginRecord => loginRecord.user,
  )
  public loginRecords: LoginRecord[];
}
