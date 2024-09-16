import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { faker } from "@faker-js/faker";

import { TypeOrmTestingConfig } from "@/shared/testUtils/typeorm-config";
import { Airport } from "./airport.entity";
import { AirportService } from "./airport.service";

describe("AirportService", () => {
  let service: AirportService;
  let repository: Repository<Airport>;
  let airlinesList: Airport[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<Airport>>(getRepositoryToken(Airport));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for (let i = 0; i < 5; i++) {
      const airport: Airport = await repository.save({
        city: faker.location.city(),
        code: faker.location.zipCode(),
        name: faker.word.noun(),
        country: faker.location.country(),
      });
      airlinesList.push(airport);
    }
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all airlines", async () => {
    const airlines: Airport[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it("should return airport by id", async () => {
    const storedAirline: Airport = airlinesList[0];
    const airport: Airport = await service.findOne(storedAirline.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirline.name);
  });

  it("should throw an error when airport with given id is not found", async () => {
    await expect(service.findOne("-1")).rejects.toHaveProperty(
      "message",
      "Airport not found",
    );
  });

  it("should create a airport", async () => {
    const airlineData = {
      city: faker.location.city(),
      code: faker.location.zipCode(),
      name: faker.word.noun(),
      country: faker.location.country(),
    };

    const createdAirline: Airport = await service.create(airlineData);

    expect(createdAirline).not.toBeNull();
    expect(createdAirline.id).toBeDefined();
    expect(createdAirline.name).toEqual(airlineData.name);
  });

  it("should update a airport", async () => {
    const airport: Airport = airlinesList[0];
    airport.name = `${faker.word.verb()} NEW`;

    const updatedAirline: Airport = await service.update(airport.id, airport);
    expect(updatedAirline).not.toBeNull();
    expect(updatedAirline.name).toEqual(airport.name);
  });

  it("should throw an error when airport with given id is not found", async () => {
    const airport: Airport = airlinesList[0];
    airport.name = `${faker.company.name()} UPDATED`;

    await expect(service.update("-1", airport)).rejects.toHaveProperty(
      "message",
      "Airport not found",
    );
  });

  it("should delete a airport", async () => {
    const airport: Airport = airlinesList[0];
    await service.delete(airport.id);

    const deletedAirline: Airport = await repository.findOne({
      where: { id: airport.id },
    });
    expect(deletedAirline).toBeNull();
  });

  it("should throw an error when airport with given id is not found", async () => {
    await expect(service.delete("-1")).rejects.toHaveProperty(
      "message",
      "Airport not found",
    );
  });
});
