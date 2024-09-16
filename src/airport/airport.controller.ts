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
import { CreateAirportDto, UpdateAirportDto } from "./airport.dto";
import { AirportService } from "./airport.service";

@Controller("airports")
@UseInterceptors(
  ExceptionsInterceptor,
  new UUIDValidationInterceptor("airportId"),
)
export class AirportController {
  constructor(private readonly airportService: AirportService) {}

  @Get()
  async findAll() {
    return this.airportService.findAll();
  }

  @Get(":airportId")
  async findOne(@Param("airportId") id: string) {
    return this.airportService.findOne(id);
  }

  @Post()
  async create(@Body() airportDto: CreateAirportDto) {
    return this.airportService.create(airportDto);
  }

  @Patch(":airportId")
  async update(
    @Param("airportId") id: string,
    @Body() airportDto: UpdateAirportDto,
  ) {
    return this.airportService.update(id, airportDto);
  }

  @Delete(":airportId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("airportId") id: string) {
    return this.airportService.delete(id);
  }
}
