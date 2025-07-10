import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DbConfig } from "../config/db.config";
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
    ]),
  ],
})
export class DatabaseModule {}
