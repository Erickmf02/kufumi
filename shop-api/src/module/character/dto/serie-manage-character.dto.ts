import { IsEnum, IsInt, IsNotEmpty, IsPositive } from "class-validator";

export enum SerieManageAction {
  ADD = "add",
  REMOVE = "remove",
}

export class SerieManageCharacterDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  characterId: number;

  @IsEnum(SerieManageAction)
  action: SerieManageAction;
}
