import { Configuration, Value } from "@itgorillaz/configify";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

@Configuration()
export class RedisConfig {
  @Value("REDIS_HOST")
  @IsNotEmpty()
  @IsString()
  host: string;

  @Value("REDIS_PORT", { default: 6379, parse: parseInt })
  @IsNotEmpty()
  @IsNumber()
  port: number;
}
