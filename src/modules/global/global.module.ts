import { Global, Module } from "@nestjs/common";
import { BcryptService } from "../../services/bcrypt.service";

@Global()
@Module({
  controllers: [],
  providers: [BcryptService],
  exports: [BcryptService],
})
export class GlobalModule {}
