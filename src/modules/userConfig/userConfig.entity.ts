import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ObjectType, Field } from 'type-graphql';

@Entity()
@ObjectType()
export class UserConfig {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public userId: string;

  @OneToOne(
    type => User,
    user => user.config,
  )
  @JoinColumn()
  public user: User;
}
