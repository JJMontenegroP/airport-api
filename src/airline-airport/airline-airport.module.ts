import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Airline } from "@/airline/airline.entity";
import { Airport } from "@/airport/airport.entity";
import { AirlineAirportController } from "./airline-airport.controller";
import { AirlineAirportService } from "./airline-airport.service";

@Module({
  imports: [TypeOrmModule.forFeature([Airline, Airport])],
  providers: [AirlineAirportService],
  controllers: [AirlineAirportController],
})
export class AirlineAirportModule {}
