import { ConfigifyModule } from "@itgorillaz/configify";
import { ThrottlerStorageRedisService } from "@nest-lab/throttler-storage-redis";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { seconds, ThrottlerModule } from "@nestjs/throttler";
import Redis from "ioredis";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RedisConfig } from "./config/redis.config";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CommentModule } from "./modules/comment/comment.module";
import { FollowModule } from "./modules/follow/follow.module";
import { GlobalModule } from "./modules/global/global.module";
import { LikeModule } from "./modules/like/like.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { PostModule } from "./modules/post/post.module";

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    ThrottlerModule.forRootAsync({
      inject: [RedisConfig],
      useFactory: (config: RedisConfig) => ({
        throttlers: [{ limit: 50, ttl: seconds(60) }],
        storage: new ThrottlerStorageRedisService(
          new Redis({
            port: config.port,
            host: config.host,
            // db: configService.get<number>('REDIS_DB'),
          }),
        ),
      }),
    }),
    DatabaseModule,
    AuthModule,
    GlobalModule,
    RouterModule.register([
      { path: "auth", module: AuthModule },
      { path: "post", module: PostModule },
      { path: "comment", module: CommentModule },
      { path: "like", module: LikeModule },
      { path: "follow", module: FollowModule },
      { path: "notifications", module: NotificationModule },
    ]),
    PostModule,
    CommentModule,
    LikeModule,
    FollowModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
