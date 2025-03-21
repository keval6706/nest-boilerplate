import { config } from 'dotenv';
import path from 'path';
import { DataSource } from 'typeorm';

config({ path: '.env' });

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, '../database/entities/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  synchronize: false,
  useUTC: true,
  logging: false,
});

export default dataSource;
