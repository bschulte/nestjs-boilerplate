import { InputType, Field } from 'type-graphql';

@InputType()
export class UserInputDto {
  @Field()
  public id: string;

  @Field()
  public group: string;

  @Field(type => [String])
  public subGroups: string[];

  @Field()
  public locked: boolean;
}
