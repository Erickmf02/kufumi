import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl } from "class-validator"

export class CreateProductDto {
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
  @IsInt()
  @IsPositive()
  value: number

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  stock: number

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  image: string
  
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({each: true})
  @IsUrl({}, {each: true})
  images: string[]

  @IsOptional()
  @IsInt()
  @IsPositive()
  characterId?: number
}