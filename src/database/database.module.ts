import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DbConfig } from "../config/db.config";
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { Follow, FollowSchema } from "./schemas/follow.schema";
import { Like, LikeSchema } from "./schemas/like.schema";
import { Post, PostSchema } from "./schemas/post.schema";
import { Session, SessionSchema } from "./schemas/session.schema";
import { User, UserSchema } from "./schemas/user.schema";

@Module({
  providers: [],
  exports: [MongooseModule],
  imports: [
    MongooseModule.forRootAsync({
      inject: [DbConfig],
      useFactory: (config: DbConfig) => ({
        uri: config.uri,
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Follow.name, schema: FollowSchema },
    ]),
  ],
})
export class DatabaseModule {}
