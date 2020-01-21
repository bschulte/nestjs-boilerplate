import { ClassType } from 'class-transformer/ClassTransformer';
import { ObjectType, Field, Int } from 'type-graphql';

export function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>): any {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(type => [TItemClass])
    public results: TItem[];

    @Field(type => Int)
    public count: number;
  }

  return PaginatedResponseClass;
}
