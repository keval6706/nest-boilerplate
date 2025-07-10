import { Configuration, Value } from "@itgorillaz/configify";
import { IsNotEmpty, IsString } from "class-validator";

@Configuration()
export class DbConfig {
  @Value("MONGODB_URI")
  @IsNotEmpty()
  @IsString()
  uri: string;
}
