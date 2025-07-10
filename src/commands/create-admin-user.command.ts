import { BadRequestException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Command, CommandRunner, Option } from "nest-commander";
import { User, UserDocument } from "../database/schemas/user.schema";
import { UserRole } from "../enums/user.enum";
import { BcryptService } from "../services/bcrypt.service";

@Command({
  name: "create-admin-user",
  description: "Create admin user",
})
export class CreateAdminUserCommand extends CommandRunner {
  private readonly logger = new Logger(CreateAdminUserCommand.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly bcryptService: BcryptService,
  ) {
    super();
  }

  async run(inputs: string[], payload: Record<string, string>): Promise<void> {
    const user = await this.userModel.findOne({
      email: payload.email,
    });

    if (user) throw new BadRequestException("Already signed up.");

    const newUser = new this.userModel({
      ...payload,
      password: this.bcryptService.hashSync(payload.password),
      role: UserRole.ADMIN,
    });

    const savedUser = await newUser.save();
    this.logger.warn(await this.userModel.findById(savedUser._id));
  }

  @Option({
    flags: "-fn, --firstName <firstName>",
    description: "A first name",
    required: true,
  })
  parsefirstName(val: string) {
    return val;
  }

  @Option({
    flags: "-ln, --lastName <lastName>",
    description: "A last name",
    required: true,
  })
  parselastName(val: string) {
    return val;
  }

  @Option({
    flags: "-e, --email <email>",
    description: "A email",
    required: true,
  })
  parseEmail(val: string) {
    return val;
  }

  @Option({
    flags: "-p, --password <password>",
    description: "A password",
    required: true,
  })
  parsePassword(val: string) {
    return val;
  }

  // @Option({
  //   flags: '-u, --userName <userName>',
  //   description: 'A username',
  //   required: true,
  // })
  // parseUsername(val: string) {
  //   return val;
  // }
}
