import { Module } from '@nestjs/common';
import { ConfigifyModule } from '@itgorillaz/configify';
import { CommandRunnerModule } from 'nest-commander';
import { DatabaseModule } from '../database/database.module';
import { GlobalModule } from '../modules/global/global.module';
import { CreateAdminUserCommand } from './create-admin-user.command';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    DatabaseModule,
    CommandRunnerModule,
    GlobalModule,
  ],
  controllers: [],
  providers: [CreateAdminUserCommand],
})
export class CommandsModule {}
