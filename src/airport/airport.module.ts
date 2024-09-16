import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AirportController } from "./airport.controller";
import { Airport } from "./airport.entity";
import { AirportService } from "./airport.service";

@Module({
  imports: [TypeOrmModule.forFeature([Airport])],
  providers: [AirportService],
  controllers: [AirportController],
})
export class AirportModule {}
