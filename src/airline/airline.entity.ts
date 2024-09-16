import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Airport } from "@/airport/airport.entity";

@Entity()
export class Airline {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: "date",
  })
  foundationDate: string;

  @Column()
  website: string;

  @ManyToMany(() => Airport, (airport) => airport.airlines)
  airports: Airport[];
}
