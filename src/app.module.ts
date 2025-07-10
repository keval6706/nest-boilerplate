import { ConfigifyModule } from "@itgorillaz/configify";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CommentModule } from "./modules/comment/comment.module";
import { FollowModule } from "./modules/follow/follow.module";
import { GlobalModule } from "./modules/global/global.module";
import { LikeModule } from "./modules/like/like.module";
import { PostModule } from "./modules/post/post.module";

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    DatabaseModule,
    AuthModule,
    GlobalModule,
    RouterModule.register([
      { path: "auth", module: AuthModule },
      { path: "post", module: PostModule },
      { path: "comment", module: CommentModule },
      { path: "like", module: LikeModule },
      { path: "follow", module: FollowModule },
    ]),
    PostModule,
    CommentModule,
    LikeModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
