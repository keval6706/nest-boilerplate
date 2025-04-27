import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './modules/global/global.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { RouterModule } from '@nestjs/core';
import { ConfigifyModule } from '@itgorillaz/configify';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    DatabaseModule,
    AuthModule,
    ProductModule,

    RouterModule.register([
      { path: 'auth', module: AuthModule },
      { path: 'product', module: ProductModule },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, GlobalModule],
})
export class AppModule {}
