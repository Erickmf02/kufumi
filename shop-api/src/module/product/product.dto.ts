import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsPositive, IsString, IsUrl } from "class-validator"

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  description: string
  
  @IsInt()
  @IsPositive()
  value: number

  @IsInt()
  @IsPositive()
  stock: number

  @IsString()
  @IsUrl()
  image: string

  @IsArray()
  @ArrayMinSize(1)
  @IsString({each: true})
  @IsUrl({}, {each: true})
  images: string[]
}