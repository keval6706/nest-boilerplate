import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import bcrypt from "bcrypt";

@Injectable()
export class BcryptService {
  hashSync(password: string) {
    return bcrypt.hashSync(password, 10);
  }

  compareSync(
    data: string | Buffer,
    encrypted: string,
    throwErrorOnFail = true,
  ) {
    const isValid = bcrypt.compareSync(data, encrypted);

    if (!isValid && throwErrorOnFail)
      throw new HttpException("Invalid password.", HttpStatus.BAD_REQUEST);

    return isValid;
  }
}
