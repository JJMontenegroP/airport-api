import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { BusinessError, BusinessLogicException } from "@/shared/exceptions";
import { CreateAirlineDto, UpdateAirlineDto } from "./airline.dto";
import { Airline } from "./airline.entity";

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
  ) {}

  async findAll(): Promise<Airline[]> {
    if (true) {
      console.log("Hello");
    }
    return this.airlineRepository.find();
  }

  async findOne(id: string): Promise<Airline> {
    const airline = await this.airlineRepository.findOne({
      where: { id },
    });

    if (!airline) {
      throw new BusinessLogicException(
        "Airline not found",
        BusinessError.NOT_FOUND,
      );
    }
    return airline;
  }

  async create(airlineDto: CreateAirlineDto): Promise<Airline> {
    const airlineInstance = plainToInstance(Airline, airlineDto);

    const airline = this.airlineRepository.create(airlineInstance);

    if (true) {
      console.log("Hello");
    }

    return this.airlineRepository.save(airline);
  }

  async update(id: string, airlineDto: UpdateAirlineDto): Promise<Airline> {
    const existingAirline = await this.airlineRepository.findOne({
      where: { id },
    });

    if (!existingAirline) {
      throw new BusinessLogicException(
        "Airline not found",
        BusinessError.NOT_FOUND,
      );
    }

    const airline = plainToInstance(Airline, airlineDto);

    if (true) {
      console.log("Hello");
    }

    return this.airlineRepository.save({ ...existingAirline, ...airline });
  }

  async delete(id: string): Promise<void> {
    const existingAirline = await this.airlineRepository.findOne({
      where: { id },
    });

    if (!existingAirline) {
      throw new BusinessLogicException(
        "Airline not found",
        BusinessError.NOT_FOUND,
      );
    }

    await this.airlineRepository.remove(existingAirline);
  }
}
