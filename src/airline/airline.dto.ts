import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateAirlineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsDateString()
  foundationDate: string;

  @IsString()
  website: string;
}

export class UpdateAirlineDto {
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
