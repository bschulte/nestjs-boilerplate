import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateUserConfigDto {
  @IsNumber()
  @IsOptional()
  public tourTaken?: boolean;

  @IsNumber()
  @IsOptional()
  public mdmSideLoadedAppNotificationsEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  public riskScoreThreshold?: number;

  @IsString()
  @IsOptional()
  public riskScoreThresholdAlertEmail?: string;

  @IsString()
  @IsOptional()
  public country?: string;
}
