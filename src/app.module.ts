import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { GlobalModule } from './modules/global/global.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      isGlobal: true,
      cache: true,
    }),
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
