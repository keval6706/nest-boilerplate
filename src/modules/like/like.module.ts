import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "../../database/schemas/comment.schema";
import { Like, LikeSchema } from "../../database/schemas/like.schema";
import { Post, PostSchema } from "../../database/schemas/post.schema";
import { NotificationModule } from "../notification/notification.module";
import { LikeController } from "./like.controller";
import { LikeService } from "./like.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    NotificationModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
