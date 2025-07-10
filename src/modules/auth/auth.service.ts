import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Session,
  SessionDocument,
} from "../../database/schemas/session.schema";
import { User, UserDocument } from "../../database/schemas/user.schema";
import { BcryptService } from "../../services/bcrypt.service";
import { OAuthPayload } from "../../types/jwt";
import { LoginDto, SignupDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
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

    return await user.save();
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

    const session = await this.sessionModel.create({
      userId: user._id,
      ipAddress,
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
      token: await this.jwtService.signAsync(payload),
    };
  }

  async logout(user: User, sessionId: string) {
    await this.sessionModel.deleteOne({
      _id: sessionId,
      userId: user._id,
    });
  }
}
