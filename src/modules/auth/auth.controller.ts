import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { Auth } from "../../decorators/auth.decorator";
import { UserRole } from "../../enums/user.enum";
import { LoginDto, SignupDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller()
@UsePipes(new ValidationPipe({ whitelist: true }))
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @HttpCode(HttpStatus.OK)
  async signup(@Body() body: SignupDto) {
    return {
      data: await this.authService.signup(body),
      message: "Signup successfull",
    };
  }

  @Post("login")
  @ApiBody({ type: LoginDto })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return {
      data: await this.authService.login(body),
      message: "Login successfull",
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  // @Auth()
  @Auth([UserRole.USER, UserRole.ADMIN])
  async logout() {
    return {
      data: await this.authService.logout(),
      message: "Logout successfull",
    };
  }
}
