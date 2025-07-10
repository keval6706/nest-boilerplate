import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { OAuthPayload } from "../types/jwt";

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: OAuthPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<OAuthPayload> {
    return this.jwtService.verifyAsync(token);
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.jwtService.decode(token);
      if (!decoded || typeof decoded !== "object" || !("exp" in decoded)) {
        return true;
      }
      return Date.now() >= (decoded.exp as number) * 1000;
    } catch {
      return true;
    }
  }
}
