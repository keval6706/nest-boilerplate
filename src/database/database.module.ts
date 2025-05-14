import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";
import { DbConfig } from "../config/db.config";

@Module({
  providers: [],
  exports: [],
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [DbConfig],
      useFactory: (config: DbConfig) => ({
        type: "postgres",
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [path.join(__dirname, "entities/*.entity{.ts,.js}")],
        synchronize: false,
        logging: false,
        autoLoadEntities: false,
        useUTC: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
