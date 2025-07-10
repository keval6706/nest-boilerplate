import { ConfigifyModule } from "@itgorillaz/configify";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommandRunnerModule } from "nest-commander";
import { DatabaseModule } from "../database/database.module";
import { User, UserSchema } from "../database/schemas/user.schema";
import { GlobalModule } from "../modules/global/global.module";
import { CreateAdminUserCommand } from "./create-admin-user.command";

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    DatabaseModule,
    CommandRunnerModule,
    GlobalModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [CreateAdminUserCommand],
})
export class CommandsModule {}
