import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from "@nestjs/common";

import {
  ExceptionsInterceptor,
  UUIDValidationInterceptor,
} from "@/shared/interceptors";
import { UpdateAirportFromAirlineDto } from "./airline-airport.dto";
import { AirlineAirportService } from "./airline-airport.service";

@Controller("airlines")
@UseInterceptors(
  ExceptionsInterceptor,
  new UUIDValidationInterceptor("airlineId"),
)
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportService) {}

  @Post(":airlineId/airports/:airportId")
  async addAirportToAirline(
    @Param("airlineId") airlineId: string,
    @Param("airportId") airportId: string,
  ) {
    return this.airlineAirportService.addAirportToAirline(airlineId, airportId);
  }

  @Get(":airlineId/airports")
  async findAirportsFromAirline(@Param("airlineId") airlineId: string) {
    return this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Get(":airlineId/airports/:airportId")
  async findAirportFromAirline(
    @Param("airlineId") airlineId: string,
    @Param("airportId") airportId: string,
  ) {
    return this.airlineAirportService.findAirportFromAirline(
      airlineId,
      airportId,
    );
  }

  @Patch(":airlineId/airports")
  async updateAirportsFromAirline(
    @Param("airlineId") airlineId: string,
    @Body() airports: UpdateAirportFromAirlineDto[],
  ) {
    return this.airlineAirportService.updateAirportsFromAirline(
      airlineId,
      airports,
    );
  }

  @Delete(":airlineId/airports/:airportId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAirportFromAirline(
    @Param("airlineId") airlineId: string,
    @Param("airportId") airportId: string,
  ) {
    return this.airlineAirportService.deleteAirportFromAirline(
      airlineId,
      airportId,
    );
  }
}
