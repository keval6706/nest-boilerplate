import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { User } from "../../database/schemas/user.schema";
import { AuthUser } from "../../decorators/user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GetNotificationsDto } from "./notification.dto";
import { NotificationService } from "./notification.service";

@Controller()
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
@ApiTags("Notifications")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(
    @AuthUser() user: User,
    @Query() query: GetNotificationsDto,
  ) {
    return this.notificationService.getUserNotifications(
      user._id.toString(),
      query,
    );
  }

  @Get("unread-count")
  async getUnreadCount(@AuthUser() user: User) {
    const count = await this.notificationService.getUnreadCount(
      user._id.toString(),
    );
    return { count };
  }

  @Patch(":id/read")
  async markAsRead(
    @Param("id") notificationId: string,
    @AuthUser() user: User,
  ) {
    return this.notificationService.markAsRead(
      notificationId,
      user._id.toString(),
    );
  }

  @Patch("mark-all-read")
  async markAllAsRead(@AuthUser() user: User) {
    return this.notificationService.markAllAsRead(user._id.toString());
  }

  @Delete(":id")
  async deleteNotification(
    @Param("id") notificationId: string,
    @AuthUser() user: User,
  ) {
    await this.notificationService.deleteNotification(
      notificationId,
      user._id.toString(),
    );
    return { message: "Notification deleted successfully" };
  }
}
