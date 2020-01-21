import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/user/user.entity';
import { Notification } from 'src/modules/notification/notification.entity';

@Entity()
export class NotificationStatus {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ select: false })
  public userId: string;

  @Column({ select: false })
  public userNotificationId: string;

  @Column()
  public status: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column()
  public uuid: string;

  @ManyToOne(
    type => User,
    user => user.notifications,
  )
  public user: User;

  @ManyToOne(
    type => Notification,
    notification => notification.notificationStatuses,
  )
  public notification: Notification;
}
