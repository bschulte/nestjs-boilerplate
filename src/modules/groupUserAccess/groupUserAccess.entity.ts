import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ObjectType, Field } from 'type-graphql';

@Entity()
@ObjectType()
export class GroupUserAccess {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ default: true })
  @Field()
  public canViewReports: boolean;

  @Column({ default: true })
  @Field()
  public canSubmit: boolean;

  @Column({ default: false })
  @Field()
  public locked: boolean;

  @OneToOne(
    type => User,
    user => user.groupUserAccess,
  )
  @JoinColumn()
  public user: User;
  @Column()
  public userId: string;
}
