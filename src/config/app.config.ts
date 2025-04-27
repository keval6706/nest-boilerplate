import { Configuration, Value } from '@itgorillaz/configify';

@Configuration()
export class AppConfig {
  @Value('PORT', { default: 8080, parse: parseInt })
  port: number;
}
