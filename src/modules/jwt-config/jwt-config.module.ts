import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { readFileSync } from "fs";
import { join } from "path";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [],
      useFactory: () => ({
        global: true,
        signOptions: {
          algorithm: "ES256",
          expiresIn: "15m", // Access token expires in 15 minutes
        },
        privateKey: readFileSync(join(process.cwd(), "jwt.key")),
        publicKey: readFileSync(join(process.cwd(), "jwt.key.pub")),
        verifyOptions: {
          ignoreExpiration: false,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [],
  exports: [JwtModule],
})
export class JwtConfigModule {}
