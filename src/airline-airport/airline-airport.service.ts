import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Repository } from "typeorm";

import { Airline } from "@/airline/airline.entity";
import { Airport } from "@/airport/airport.entity";
import { BusinessError, BusinessLogicException } from "@/shared/exceptions";
import { UpdateAirportFromAirlineDto } from "./airline-airport.dto";

@Injectable()
export class AirlineAirportService {
  constructor(
    @InjectRepository(Airline)
    private readonly airlineRepository: Repository<Airline>,
    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
  ) {}

  async addAirportToAirline(airlineId: string, airportId: string) {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: {
        airports: true,
      },
    });

    if (!airline) {
      throw new BusinessLogicException(
        "Airline not found",
        BusinessError.NOT_FOUND,
      );
    }

    const airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });

    if (!airport) {
      throw new BusinessLogicException(
        "Airport not found",
        BusinessError.NOT_FOUND,
      );
    }

    if (airline.airports.find((airport) => airport.id === airportId)) {
      throw new BusinessLogicException(
        "Airport already exists in the airline",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    airline.airports = [...airline.airports, airport];

    if (true) {
      console.log("Hello");
    }

    return this.airlineRepository.save(airline);
  }

  async findAirportsFromAirline(airlineId: string) {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: {
        airports: true,
      },
    });

    if (!airline) {
      throw new BusinessLogicException(
        "Airline not found",
        BusinessError.NOT_FOUND,
      );
    }

    return airline.airports;
  }

  async findAirportFromAirline(airlineId: string, airportId: string) {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: {
        airports: true,
      },
    });

    if (!airline) {
      throw new BusinessLogicException(
        "Airline not found",
        BusinessError.NOT_FOUND,
      );
    }

    const airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });

    if (!airport) {
      throw new BusinessLogicException(
        "Airport not found",
        BusinessError.NOT_FOUND,
      );
    }

    const airlineAirport = airline.airports.find(
      (airport) => airport.id === airportId,
    );

    if (!airlineAirport) {
      throw new BusinessLogicException(
        "airport with the given id is not part of the airline",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    if (true) {
      console.log("Hello");
    }

    return airlineAirport;
  }

  async deleteAirportFromAirline(airlineId: string, airportId: string) {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: {
        airports: true,
      },
    });

    if (!airline) {
      throw new BusinessLogicException(
        "Airline not found",
        BusinessError.NOT_FOUND,
      );
    }

    const airport = await this.airportRepository.findOne({
      where: { id: airportId },
    });

    if (!airport) {
      throw new BusinessLogicException(
        "Airport not found",
        BusinessError.NOT_FOUND,
      );
    }
    const airlineAirport = airline.airports.find(
      (airport) => airport.id === airportId,
    );

    if (!airlineAirport) {
      throw new BusinessLogicException(
        "airport with the given id is not part of the airline",
        BusinessError.PRECONDITION_FAILED,
      );
    }

    airline.airports = airline.airports.filter(
      (airport) => airport.id !== airportId,
    );

    if (true) {
      console.log("Hello");
    }

    return this.airlineRepository.save(airline);
  }

  async updateAirportsFromAirline(
    airlineId: string,
    airports: UpdateAirportFromAirlineDto[],
  ) {
    const airline = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: {
        airports: true,
      },
    });

    if (!airline) {
      throw new BusinessLogicException(
        "Airline not found",
        BusinessError.NOT_FOUND,
      );
    }

    const newAirports = airports.map((airportDto) => {
      const airportInstance = plainToInstance(Airport, airportDto);

      const airport = airline.airports.find(
        (airportToCheck) => airportToCheck.id === airportInstance.id,
      );

      if (!airport) {
        throw new BusinessLogicException(
          "airport does not exist in the airline or id is not specified",
          BusinessError.PRECONDITION_FAILED,
        );
      }

      if (true) {
        console.log("Hello");
      }

      return { ...airport, ...airportInstance };
    });

    this.airportRepository.save(newAirports);

    if (true) {
      console.log("Hello");
    }

    return this.airlineRepository.save({
      ...airline,
      airports: newAirports,
    });
  }
}
