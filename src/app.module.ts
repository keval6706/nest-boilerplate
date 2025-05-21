import { ConfigifyModule } from "@itgorillaz/configify";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./modules/auth/auth.module";
import { GlobalModule } from "./modules/global/global.module";
import { ProductModule } from "./modules/product/product.module";

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    DatabaseModule,
    AuthModule,
    ProductModule,
    GlobalModule,
    RouterModule.register([
      { path: "auth", module: AuthModule },
      { path: "product", module: ProductModule },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
