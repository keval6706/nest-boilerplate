import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { randomBytes } from "crypto";
import moment from "moment";
import { Model } from "mongoose";
import {
  Session,
  SessionDocument,
} from "../../database/schemas/session.schema";
import { User, UserDocument } from "../../database/schemas/user.schema";
import { BcryptService } from "../../services/bcrypt.service";
import { TokenService } from "../../services/token.service";
import { OAuthPayload } from "../../types/jwt";
import { LoginDto, RefreshTokenDto, SignupDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
    private readonly tokenService: TokenService,
  ) {}

  async signup(body: SignupDto) {
    const existingUser = await this.userModel.findOne({ email: body.email });

    if (existingUser) {
      throw new BadRequestException(
        "Already signed up. Please login to continue",
      );
    }

    const user = new this.userModel({
      ...body,
      password: this.bcryptService.hashSync(body.password),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = (await user.save()).toJSON();
    return rest;
  }

  async login(loginDto: LoginDto) {
    const { email, password, ipAddress } = loginDto;

    const user = await this.userModel
      .findOne({ email })
      .select("+password")
      .exec();

    if (!user) {
      throw new BadRequestException("User not found");
    }

    this.bcryptService.compareSync(password, user.password);

    const refreshToken = this.generateRefreshToken();
    const refreshTokenExpiresAt = moment().add(7, "days").toDate();

    const session = await this.sessionModel.create({
      user: user._id,
      ipAddress,
      refreshToken,
      refreshTokenExpiresAt,
    });

    const payload: OAuthPayload = {
      id: user._id.toString(),
      email: user.email,
      sessionId: session._id.toString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...userWithoutPassword } = user.toObject();

    return {
      ...userWithoutPassword,
      accessToken: await this.tokenService.generateAccessToken(payload),
      refreshToken,
    };
  }

  async logout(user: User, sessionId: string) {
    await this.sessionModel.deleteOne({
      _id: sessionId,
      user: user._id,
    });
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    const session = await this.sessionModel
      .findOne({
        refreshToken,
        refreshTokenExpiresAt: { $gt: new Date() },
      })
      .populate("user")
      .exec();

    if (!session) {
      throw new BadRequestException("Invalid or expired refresh token");
    }

    const user = await this.userModel.findById(session.user);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    // Generate new tokens
    const newRefreshToken = this.generateRefreshToken();
    const refreshTokenExpiresAt = moment().add(7, "days").toDate();

    // Update session with new refresh token
    await this.sessionModel.updateOne(
      { _id: session._id },
      {
        refreshToken: newRefreshToken,
        refreshTokenExpiresAt: refreshTokenExpiresAt,
      },
    );

    const payload: OAuthPayload = {
      id: user._id.toString(),
      email: user.email,
      sessionId: session._id.toString(),
    };

    return {
      accessToken: await this.tokenService.generateAccessToken(payload),
      refreshToken: newRefreshToken,
    };
  }

  private generateRefreshToken(): string {
    return randomBytes(32).toString("hex");
  }

  // Optional: Method to clean up expired refresh tokens
  async cleanupExpiredRefreshTokens() {
    const result = await this.sessionModel.deleteMany({
      refreshTokenExpiresAt: { $lt: new Date() },
    });
    return result.deletedCount;
  }
}
