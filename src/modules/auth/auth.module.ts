import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Session, SessionSchema } from "../../database/schemas/session.schema";
import { User, UserSchema } from "../../database/schemas/user.schema";
import { TokenService } from "../../services/token.service";
import { JwtConfigModule } from "../jwt-config/jwt-config.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    JwtConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService],
})
export class AuthModule {}
