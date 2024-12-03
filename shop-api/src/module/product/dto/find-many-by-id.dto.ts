import { ArrayMinSize, IsArray, IsInt, IsPositive } from "class-validator";
import { HasUniqueNumbers } from "src/common/validations/has-unique-numbers";

export class findManyByIdDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({each: true})
  @IsPositive({each: true})
  @HasUniqueNumbers()
  ids: number[]
}