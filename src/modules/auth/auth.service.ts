import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Session } from "../../database/entities/session.entity";
import { User } from "../../database/entities/user.entity";
import { AuthUser } from "../../services/auth-user.service";
import { BcryptService } from "../../services/bcrypt.service";
import { OAuthPayload } from "../../types/jwt";
import { LoginDto, SignupDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly authUser: AuthUser,
    private readonly bcryptService: BcryptService,
  ) {}

  async signup(body: SignupDto) {
    const u = await this.dataSource.getRepository(User).findOneBy({
      email: body.email,
    });

    if (u)
      throw new BadRequestException(
        "Already signed up. Please login to continue",
      );

    const user = this.dataSource.getRepository(User).create({
      ...body,
      password: this.bcryptService.hashSync(body.password),
    });

    return await this.dataSource.getRepository(User).save(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password, ipAddress } = loginDto;

    const user = await this.dataSource.getRepository(User).findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    this.bcryptService.compareSync(password, user.password);

    const session = await this.dataSource
      .getRepository(Session)
      .save({ userId: user.id, ipAddress });

    const payload: OAuthPayload = {
      id: user.id,
      email: user.email,
      sessionId: session.id,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ..._user } = user;

    return { ..._user, token: await this.jwtService.signAsync(payload) };
  }

  async logout() {
    const session = this.authUser.session;
    const user = this.authUser.user;
    await this.dataSource
      .getRepository(Session)
      .delete({ id: session, userId: user.id });
  }
}
