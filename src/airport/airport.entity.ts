import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Airline } from "@/airline/airline.entity";

@Entity()
export class Airport {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @ManyToMany(() => Airline, (airline) => airline.airports)
  @JoinTable()
  airlines: Airline[];
}
