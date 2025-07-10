import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Follow, FollowSchema } from "../../database/schemas/follow.schema";
import { Post, PostSchema } from "../../database/schemas/post.schema";
import { User, UserSchema } from "../../database/schemas/user.schema";
import { FollowController } from "./follow.controller";
import { FollowService } from "./follow.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
