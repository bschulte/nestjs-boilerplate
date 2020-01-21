import {
  IsBoolean,
  IsBooleanString,
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class UpdateGroupUserDto {
  @IsBoolean()
  @IsOptional()
  public canSubmit?: boolean;

  @IsBoolean()
  @IsOptional()
  public canViewReports?: boolean;

  @IsBoolean()
  @IsOptional()
  public locked?: boolean;

  @IsString({ each: true })
  @IsOptional()
  public subGroups?: string[];
}
