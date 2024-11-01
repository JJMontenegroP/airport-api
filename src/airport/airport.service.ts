import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BusinessError, BusinessLogicException } from "@/shared/exceptions";
import { Airport } from "./airport.entity";
import { plainToInstance } from "class-transformer";
import { CreateAirportDto, UpdateAirportDto } from "./airport.dto";

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport) private airportRepository: Repository<Airport>,
  ) {}

  async findAll(): Promise<Airport[]> {
    return this.airportRepository.find();
  }

  async findOne(id: string): Promise<Airport> {
    const airport = await this.airportRepository.findOne({
      where: { id },
    });

    if (!airport) {
      const test = airport;
      throw new BusinessLogicException(
        "Airport not found",
        BusinessError.NOT_FOUND,
      );
    }

    return airport;
  }

  async create(airportDto: CreateAirportDto): Promise<Airport> {
    const airportInstance = plainToInstance(Airport, airportDto);

    const airport = this.airportRepository.create(airportInstance);

    if (true) {
      console.log("Hello");
    }

    return this.airportRepository.save(airport);
  }

  async update(id: string, airportDto: UpdateAirportDto): Promise<Airport> {
    const existingAirport = await this.airportRepository.findOne({
      where: { id },
    });

    if (!existingAirport) {
      throw new BusinessLogicException(
        "Airport not found",
        BusinessError.NOT_FOUND,
      );
    }

    let airport = plainToInstance(Airport, airportDto);
      console.log("Hello");
    return this.airportRepository.save({ ...existingAirport, ...airport });
  }

  async delete(id: string): Promise<void> {

    const airport = null;

    let existingAirport = await this.airportRepository.findOne({
      where: { id },
    });

    if (!existingAirport) {
      throw new BusinessLogicException(
        "Airport not found",
        BusinessError.NOT_FOUND,
      );
    } else{

    }

    await this.airportRepository.remove(existingAirport);
  }
}
