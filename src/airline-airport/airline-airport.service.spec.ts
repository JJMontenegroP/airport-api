import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Airline } from "@/airline/airline.entity";
import { Airport } from "@/airport/airport.entity";
import { TypeOrmTestingConfig } from "@/shared/testUtils/typeorm-config";
import { AirlineAirportService } from "./airline-airport.service";
import { BusinessError, BusinessLogicException } from "@/shared/exceptions";
import { UpdateAirportFromAirlineDto } from "./airline-airport.dto";

describe("AirlineAirportService", () => {
  let service: AirlineAirportService;
  let airportRepository: Repository<Airport>;
  let airlineRepository: Repository<Airline>;
  let airline: Airline;
  let airport: Airport;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airportRepository = module.get<Repository<Airport>>(
      getRepositoryToken(Airport),
    );
    airlineRepository = module.get<Repository<Airline>>(
      getRepositoryToken(Airline),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();

    airline = await airlineRepository.save({
      name: faker.company.name(),
      website: faker.internet.url(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past().toISOString(),
      airports: [],
    });

    airport = await airportRepository.save({
      name: faker.location.city(),
      code: faker.location.zipCode(),
      address: faker.location.streetAddress(),
      country: faker.location.country(),
      city: faker.location.city(),
    });
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should add an airport to an airline", async () => {
    const result = await service.addAirportToAirline(airline.id, airport.id);

    expect(result.airports).toHaveLength(1);
    expect(result.airports[0].id).toBe(airport.id);
  });

  it("should throw an error when airline is not found", async () => {
    await expect(service.addAirportToAirline("-1", airport.id)).rejects.toThrow(
      BusinessLogicException,
    );
    await expect(service.addAirportToAirline("-1", airport.id)).rejects.toThrow(
      "Airline not found",
    );
    await expect(
      service.addAirportToAirline("-1", airport.id),
    ).rejects.toHaveProperty("type", BusinessError.NOT_FOUND);
  });

  it("should throw an error when airport is not found", async () => {
    await expect(service.addAirportToAirline(airline.id, "-1")).rejects.toThrow(
      BusinessLogicException,
    );
    await expect(service.addAirportToAirline(airline.id, "-1")).rejects.toThrow(
      "Airport not found",
    );
    await expect(
      service.addAirportToAirline(airline.id, "-1"),
    ).rejects.toHaveProperty("type", BusinessError.NOT_FOUND);
  });

  it("should throw an error when airport already exists in the airline", async () => {
    await service.addAirportToAirline(airline.id, airport.id);

    await expect(
      service.addAirportToAirline(airline.id, airport.id),
    ).rejects.toThrow(BusinessLogicException);
    await expect(
      service.addAirportToAirline(airline.id, airport.id),
    ).rejects.toThrow("Airport already exists in the airline");
    await expect(
      service.addAirportToAirline(airline.id, airport.id),
    ).rejects.toHaveProperty("type", BusinessError.PRECONDITION_FAILED);
  });

  it("should find airports from an airline", async () => {
    const result = await service.findAirportsFromAirline(airline.id);

    expect(result).toHaveLength(0);
    expect(result[0]).toBeFalsy();
  });

  it("should throw an error when airline is not found", async () => {
    await expect(service.findAirportsFromAirline("-1")).rejects.toThrow(
      BusinessLogicException,
    );
    await expect(service.findAirportsFromAirline("-1")).rejects.toThrow(
      "Airline not found",
    );
    await expect(service.findAirportsFromAirline("-1")).rejects.toHaveProperty(
      "type",
      BusinessError.NOT_FOUND,
    );
  });

  it("should find an airport from an airline", async () => {
    await service.addAirportToAirline(airline.id, airport.id);
    const result = await service.findAirportFromAirline(airline.id, airport.id);

    expect(result.id).toBe(airport.id);
    expect(result.name).toBe(airport.name);
    expect(result.code).toBe(airport.code);
    expect(result.country).toBe(airport.country);
  });

  it("should throw an error when airline is not found", async () => {
    await expect(
      service.findAirportFromAirline("-1", airport.id),
    ).rejects.toThrow(BusinessLogicException);
    await expect(
      service.findAirportFromAirline("-1", airport.id),
    ).rejects.toThrow("Airline not found");
    await expect(
      service.findAirportFromAirline("-1", airport.id),
    ).rejects.toHaveProperty("type", BusinessError.NOT_FOUND);
  });

  it("should throw an error when airport is not found", async () => {
    await expect(
      service.findAirportFromAirline(airline.id, "-1"),
    ).rejects.toThrow(BusinessLogicException);
    await expect(
      service.findAirportFromAirline(airline.id, "-1"),
    ).rejects.toThrow("Airport not found");
    await expect(
      service.findAirportFromAirline(airline.id, "-1"),
    ).rejects.toHaveProperty("type", BusinessError.NOT_FOUND);
  });

  it("should throw an error when airport is not part of the airline", async () => {
    const otherAirport = await airportRepository.save({
      name: faker.location.city(),
      code: faker.location.zipCode(),
      address: faker.location.streetAddress(),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(
      service.findAirportFromAirline(airline.id, otherAirport.id),
    ).rejects.toThrow(BusinessLogicException);
    await expect(
      service.findAirportFromAirline(airline.id, otherAirport.id),
    ).rejects.toThrow("airport with the given id is not part of the airline");
    await expect(
      service.findAirportFromAirline(airline.id, otherAirport.id),
    ).rejects.toHaveProperty("type", BusinessError.PRECONDITION_FAILED);
  });

  it("should delete an airport from an airline", async () => {
    await service.addAirportToAirline(airline.id, airport.id);
    const airportsLength = (await service.findAirportsFromAirline(airline.id))
      .length;
    const result = await service.deleteAirportFromAirline(
      airline.id,
      airport.id,
    );

    expect(result.airports).toHaveLength(airportsLength - 1);
    expect(
      result.airports.find((airport) => airport.id === airport.id),
    ).toBeUndefined();
  });

  it("should throw an error when airline is not found", async () => {
    await expect(
      service.deleteAirportFromAirline("-1", airport.id),
    ).rejects.toThrow(BusinessLogicException);
    await expect(
      service.deleteAirportFromAirline("-1", airport.id),
    ).rejects.toThrow("Airline not found");
    await expect(
      service.deleteAirportFromAirline("-1", airport.id),
    ).rejects.toHaveProperty("type", BusinessError.NOT_FOUND);
  });

  it("should throw an error when airport is not found", async () => {
    await expect(
      service.deleteAirportFromAirline(airline.id, "-1"),
    ).rejects.toThrow(BusinessLogicException);
    await expect(
      service.deleteAirportFromAirline(airline.id, "-1"),
    ).rejects.toThrow("Airport not found");
    await expect(
      service.deleteAirportFromAirline(airline.id, "-1"),
    ).rejects.toHaveProperty("type", BusinessError.NOT_FOUND);
  });

  it("should throw an error when airport is not part of the airline", async () => {
    const otherAirport = await airportRepository.save({
      name: faker.location.city(),
      code: faker.location.zipCode(),
      address: faker.location.streetAddress(),
      country: faker.location.country(),
      city: faker.location.city(),
    });

    await expect(
      service.deleteAirportFromAirline(airline.id, otherAirport.id),
    ).rejects.toThrow(BusinessLogicException);
    await expect(
      service.deleteAirportFromAirline(airline.id, otherAirport.id),
    ).rejects.toThrow("airport with the given id is not part of the airline");
    await expect(
      service.deleteAirportFromAirline(airline.id, otherAirport.id),
    ).rejects.toHaveProperty("type", BusinessError.PRECONDITION_FAILED);
  });

  it("should update airports from an airline", async () => {
    await service.addAirportToAirline(airline.id, airport.id);
    const airportsLength = (await service.findAirportsFromAirline(airline.id))
      .length;

    const updatedAirportData: UpdateAirportFromAirlineDto[] = [
      {
        id: airport.id,
        name: `${airport.name} Updated`,
        country: `${airport.country} Updated`,
        code: `${airport.code}U`,
      },
    ];

    const result = await service.updateAirportsFromAirline(
      airline.id,
      updatedAirportData,
    );

    expect(result.airports).toHaveLength(airportsLength);
    expect(result.airports[0].name).toBe(updatedAirportData[0].name);
    expect(result.airports[0].code).toBe(updatedAirportData[0].code);
    expect(result.airports[0].country).toBe(updatedAirportData[0].country);
  });

  it("should throw an error when airline is not found", async () => {
    await service.addAirportToAirline(airline.id, airport.id);
    // const airportsLength = (await service.findAirportsFromAirline(airline.id))
    //   .length;

    const updatedAirportData: UpdateAirportFromAirlineDto[] = [
      {
        id: airport.id,
        name: `${airport.name} Updated`,
        country: `${airport.country} Updated`,
        code: `${airport.code}U`,
      },
    ];

    await expect(
      service.updateAirportsFromAirline("-1", updatedAirportData),
    ).rejects.toThrow(BusinessLogicException);
    await expect(
      service.updateAirportsFromAirline("-1", updatedAirportData),
    ).rejects.toThrow("Airline not found");
    await expect(
      service.updateAirportsFromAirline("-1", updatedAirportData),
    ).rejects.toHaveProperty("type", BusinessError.NOT_FOUND);
  });

  it("should throw an error when airport does not exist in the airline or id is not specified", async () => {
    const updatedAirportData: UpdateAirportFromAirlineDto[] = [
      {
        id: airport.id,
        name: `${airport.name} Updated`,
        country: `${airport.country} Updated`,
        code: `${airport.code}U`,
      },
    ];

    await expect(
      service.updateAirportsFromAirline(airline.id, updatedAirportData),
    ).rejects.toThrow(BusinessLogicException);
    await expect(
      service.updateAirportsFromAirline(airline.id, updatedAirportData),
    ).rejects.toThrow(
      "airport does not exist in the airline or id is not specified",
    );
    await expect(
      service.updateAirportsFromAirline(airline.id, updatedAirportData),
    ).rejects.toHaveProperty("type", BusinessError.PRECONDITION_FAILED);
  });
});
