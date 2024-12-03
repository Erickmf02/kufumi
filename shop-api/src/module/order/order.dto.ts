import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { PaymentProvider } from "./enums/PaymentProvider.enum";
import { HasUniqueItemIds } from "src/common/validations/has-unique-item-id";

class ClientDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  rut: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  phone: string

  @IsNotEmpty()
  @IsString()
  address: string

  @IsNotEmpty()
  @IsString()
  city: string

  @IsOptional()
  @IsString()
  department?: string
}

export class CreateOrderDto {
  @IsEnum(PaymentProvider)
  paymentProvider: PaymentProvider

  @IsArray()
  @ArrayMinSize(1)
  @IsObject({each: true})
  @ValidateNested({each: true})
  @Type(() => OrderItemDto)
  @HasUniqueItemIds()
  items: OrderItemDto[]

  @IsObject()
  @ValidateNested()
  @Type(()=> ClientDto)
  client: ClientDto
}

class OrderItemDto {
  @IsInt()
  @IsPositive()
  id: number

  @IsInt()
  @IsPositive()
  stock: number
}




