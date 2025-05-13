import { Configuration, Value } from '@itgorillaz/configify';
import { IsNumber } from 'class-validator';

@Configuration()
export class AppConfig {
  @Value('PORT', { default: 8080, parse: parseInt })
  @IsNumber()
  port: number;
}
