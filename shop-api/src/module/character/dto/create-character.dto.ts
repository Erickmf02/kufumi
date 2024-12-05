import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl } from "class-validator";

export class CreateCharacterDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsNotEmpty()
  @IsString()
  shortDescription: string

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string

  @IsOptional()
  @IsInt()
  @IsPositive()
  serieId?: number
}