import { IsEnum, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export enum CharacterManageAction {
  ADD = "add",
  REMOVE = "remove"
}

export class CharacterManageProductDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId: number

  @IsEnum(CharacterManageAction)
  action: CharacterManageAction
}