import { Module } from '@nestjs/common';
import { DbConfig } from '../config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import path from 'path';

@Module({
  providers: [],
  exports: [],
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [DbConfig],
      useFactory: (config: DbConfig) => ({
        type: 'postgres',
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [path.join(__dirname, 'entities/*.entity{.ts,.js}')],
        synchronize: false,
        logging: false,
        autoLoadEntities: false,
        useUTC: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
