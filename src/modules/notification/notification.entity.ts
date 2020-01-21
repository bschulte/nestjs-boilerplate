import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { NotificationStatus } from 'src/modules/notification/notificationStatus.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public bodyHtml: string;

  @Column()
  public title: string;

  @OneToMany(
    type => NotificationStatus,
    notificationStatus => notificationStatus.notification,
  )
  public notificationStatuses: NotificationStatus[];
}
