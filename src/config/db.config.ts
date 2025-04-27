import { Configuration, Value } from '@itgorillaz/configify';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Configuration()
export class DbConfig {
  @Value('DB_HOST')
  @IsNotEmpty()
  @IsString()
  dbHost: string;

  @Value('DB_PORT', { parse: parseInt })
  @IsNotEmpty()
  @IsNumber()
  dbPort: number;

  @Value('DB_USERNAME')
  @IsNotEmpty()
  @IsString()
  dbUsername: string;

  @Value('DB_PASSWORD')
  @IsNotEmpty()
  @IsString()
  dbPassword: string;

  @Value('DB_DATABASE')
  @IsNotEmpty()
  @IsString()
  dbDatabase: string;
}
