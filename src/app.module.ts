import { ConfigifyModule } from "@itgorillaz/configify";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { GlobalModule } from "./modules/global/global.module";
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
    ]),
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
