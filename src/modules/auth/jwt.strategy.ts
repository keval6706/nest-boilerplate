import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectDataSource } from "@nestjs/typeorm";
import { FastifyRequest } from "fastify";
import { readFileSync } from "fs";
import { ExtractJwt, Strategy } from "passport-jwt";
import { join } from "path";
import { DataSource } from "typeorm";
import { Session } from "../../database/entities/session.entity";
import { OAuthPayload } from "../../types/jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: readFileSync(join(process.cwd(), "jwt.key")),
      algorithms: ["ES256"],
    });
  }

  async validate(request: FastifyRequest, payload: OAuthPayload) {
    const session = await this.dataSource.getRepository(Session).findOne({
      where: { id: payload.sessionId },
      relations: ["user"],
    });
    if (!session) throw new UnauthorizedException();

    request.session = session.id;
    if (!session.user) throw new UnauthorizedException();

    return session.user;
  }
}
