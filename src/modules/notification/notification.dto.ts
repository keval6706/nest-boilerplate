import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { NotificationType } from "../../database/schemas/notification.schema";

export class CreateNotificationDto {
  @IsString()
  recipient: string;

  @IsString()
  sender: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  relatedEntity?: string;

  @IsOptional()
  @IsString()
  relatedEntityType?: string;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}

export class GetNotificationsDto {
  @IsOptional()
  @IsString()
  page?: string = "1";

  @IsOptional()
  @IsString()
  limit?: string = "10";

  @IsOptional()
  @IsBoolean()
  unreadOnly?: boolean;

  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
