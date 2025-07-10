import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { readFileSync } from "fs";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { join } from "path";
import {
  Session,
  SessionDocument,
} from "../../database/schemas/session.schema";
import { User, UserDocument } from "../../database/schemas/user.schema";
import { OAuthPayload } from "../../types/jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: readFileSync(join(process.cwd(), "jwt.key")),
      algorithms: ["ES256"],
    });
  }

  async validate(request: Request, payload: OAuthPayload) {
    const session = await this.sessionModel
      .findById(payload.sessionId)
      .populate("userId")
      .exec();

    if (!session) throw new UnauthorizedException();

    request.session = session._id.toString();

    const user = await this.userModel.findById(session.user);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
