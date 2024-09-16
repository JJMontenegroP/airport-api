import { Airline } from "@/airline/airline.entity";
import { Airport } from "@/airport/airport.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    autoLoadEntities: true,
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([Airport, Airline]),
];
