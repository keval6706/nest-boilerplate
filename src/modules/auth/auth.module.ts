import { Module } from "@nestjs/common";
import { AuthUser } from "../../services/auth-user.service";
import { JwtConfigModule } from "../jwt-config/jwt-config.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [JwtConfigModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthUser],
})
export class AuthModule {}
