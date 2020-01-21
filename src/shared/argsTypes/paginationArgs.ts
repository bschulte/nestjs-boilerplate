import { ArgsType, Field, Int } from 'type-graphql';
import { Min, IsNumberString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, { defaultValue: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public page: number;

  @Field(type => Int, { defaultValue: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  public pageSize: number;
}
