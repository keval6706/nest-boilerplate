import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Configuration()
export class DbConfig {
  @Value('DB_HOST')
  @IsNotEmpty()
  @IsString()
  host: string;

  @Value('DB_PORT', { parse: parseInt })
  @IsNotEmpty()
  @IsNumber()
  port: number;

  @Value('DB_USERNAME')
  @IsNotEmpty()
  @IsString()
  username: string;

  @Value('DB_PASSWORD')
  @IsNotEmpty()
  @IsString()
  password: string;

  @Value('DB_DATABASE')
  @IsNotEmpty()
  @IsString()
  database: string;
}
