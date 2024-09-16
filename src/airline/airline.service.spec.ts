import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { faker } from "@faker-js/faker";

import { TypeOrmTestingConfig } from "@/shared/testUtils/typeorm-config";
import { Airline } from "./airline.entity";
import { AirlineService } from "./airline.service";

describe("AirlineService", () => {
  let service: AirlineService;
  let repository: Repository<Airline>;
  let airlinesList: Airline[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<Airline>>(getRepositoryToken(Airline));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];
    for (let i = 0; i < 5; i++) {
      const airline: Airline = await repository.save({
        name: faker.word.noun(),
        website: faker.internet.url(),
        description: faker.lorem.sentence(),
        foundationDate: faker.date.past().toISOString(),
      });
      airlinesList.push(airline);
    }
  };

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return all airlines", async () => {
    const airlines: Airline[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it("should return airline by id", async () => {
    const storedAirline: Airline = airlinesList[0];
    const airline: Airline = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name);
  });

  it("should throw an error when airline with given id is not found", async () => {
    await expect(service.findOne("-1")).rejects.toHaveProperty(
      "message",
      "Airline not found",
    );
  });

  it("should create a airline", async () => {
    const airlineData = {
      name: faker.word.noun(),
      website: faker.internet.url(),
      description: faker.lorem.sentence(),
      foundationDate: faker.date.past().toISOString(),
    };

    const createdAirline: Airline = await service.create(airlineData);

    expect(createdAirline).not.toBeNull();
    expect(createdAirline.id).toBeDefined();
    expect(createdAirline.name).toEqual(airlineData.name);
  });

  it("should update a airline", async () => {
    const airline: Airline = airlinesList[0];
    airline.name = `${faker.word.verb()} NEW`;

    const updatedAirline: Airline = await service.update(airline.id, airline);
    expect(updatedAirline).not.toBeNull();
    expect(updatedAirline.name).toEqual(airline.name);
  });

  it("should throw an error when airline with given id is not found", async () => {
    const airline: Airline = airlinesList[0];
    airline.name = `${faker.company.name()} UPDATED`;

    await expect(service.update("-1", airline)).rejects.toHaveProperty(
      "message",
      "Airline not found",
    );
  });

  it("should delete a airline", async () => {
    const airline: Airline = airlinesList[0];
    await service.delete(airline.id);

    const deletedAirline: Airline = await repository.findOne({
      where: { id: airline.id },
    });
    expect(deletedAirline).toBeNull();
  });

  it("should throw an error when airline with given id is not found", async () => {
    await expect(service.delete("-1")).rejects.toHaveProperty(
      "message",
      "Airline not found",
    );
  });
});
