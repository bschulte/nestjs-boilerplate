import { IsEmail } from 'class-validator';

export class NewUserDto {
  @IsEmail()
  public email: string;
}
