import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommandRunnerModule } from 'nest-commander';
import { join } from 'path';
import { DatabaseModule } from '../database/database.module';
import { GlobalModule } from '../modules/global/global.module';
import { CreateAdminUserCommand } from './create-admin-user.command';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(process.cwd(), '.env')],
      isGlobal: true,
      cache: true,
    }),
    DatabaseModule,
    CommandRunnerModule,
    GlobalModule,
  ],
  controllers: [],
  providers: [CreateAdminUserCommand],
})
export class CommandsModule {}
