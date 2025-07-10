import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "../../database/schemas/comment.schema";
import {
  Notification,
  NotificationSchema,
} from "../../database/schemas/notification.schema";
import { Post, PostSchema } from "../../database/schemas/post.schema";
import { User, UserSchema } from "../../database/schemas/user.schema";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
