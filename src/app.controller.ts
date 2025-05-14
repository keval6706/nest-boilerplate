import { Controller, Get, HttpStatus, VERSION_NEUTRAL } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";

@Controller({ version: VERSION_NEUTRAL })
@ApiTags("Server Health")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: "🚀 Server is working fine 🛡️.",
  })
  healthCheck() {
    return { message: "🚀 Server is working fine 🛡️." };
  }
}
