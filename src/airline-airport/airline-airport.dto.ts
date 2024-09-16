import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateAirportFromAirline {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  foundationDate?: string;

  @IsString()
  @IsOptional()
  website?: string;
}
