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
import { CreateAirlineDto, UpdateAirlineDto } from "./airline.dto";
import { AirlineService } from "./airline.service";

@Controller("airlines")
@UseInterceptors(
  ExceptionsInterceptor,
  new UUIDValidationInterceptor("airlineId"),
)
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @Get()
  async findAll() {
    const data = await this.airlineService.findAll();
    data.map((item) => ({...item,test: process.env.DB_HOST}));
    return this.airlineService.findAll();
  }

  @Get(":airlineId")
  async findOne(@Param("airlineId") id: string) {
    return this.airlineService.findOne(id);
  }

  @Post()
  async create(@Body() airlineDto: CreateAirlineDto) {
    return this.airlineService.create(airlineDto);
  }

  @Patch(":airlineId")
  async update(
    @Param("airlineId") id: string,
    @Body() airlineDto: UpdateAirlineDto,
  ) {
    return this.airlineService.update(id, airlineDto);
  }

  @Delete(":airlineId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("airlineId") id: string) {
    return this.airlineService.delete(id);
  }
}
