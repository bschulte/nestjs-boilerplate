import { IsIn } from 'class-validator';
export class UpdateNotificationDto {
  @IsIn(['unread', 'read', 'deleted'])
  public status: string;
}
