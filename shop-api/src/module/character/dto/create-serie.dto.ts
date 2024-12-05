import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateSerieDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  url: string;
}
