import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AirportModule } from "./airport/airport.module";
import { AirlineModule } from "./airline/airline.module";
import { AirlineAirportModule } from "./airline-airport/airline-airport.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      synchronize: true,
      type: "postgres",
      username: process.env.DB_USER,
    }),
    AirportModule,
    AirlineModule,
    AirlineAirportModule,
  ],
})
export class AppModule {}
