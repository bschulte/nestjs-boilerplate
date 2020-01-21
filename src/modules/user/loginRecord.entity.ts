import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'logins' })
export class LoginRecord {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ select: false })
  public userId: string;

  @CreateDateColumn()
  public loginTime: Date;

  @Column()
  public country: string;

  @Column()
  public region: string;

  @Column()
  public city: string;

  @Column()
  public lat: string;

  @Column()
  public long: string;

  @Column()
  public ip: string;

  @ManyToOne(
    type => User,
    user => user.loginRecords,
  )
  public user: User;
}
