import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { CharacterService } from "../services/character.service";
import { CreateCharacterDto } from "../dto/create-character.dto";
import { CharacterManageProductDto } from "../dto/character-manage-product.dto";
import { ParsePositiveIntPipe } from "src/common/pipes/parse-positive-int.pipe";

@Controller('character')
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService
  ) {}

  @Post()
  async create (
    @Body() dto: CreateCharacterDto
  ){
    return await this.characterService.handleCreate(dto); 
  }

  @Get(':id')
  async findById(
    @Param('id', ParsePositiveIntPipe) id: number
  ){
    return await this.characterService.handleFindById(id);
  }

  @Patch('manage/product')
  @HttpCode(HttpStatus.NO_CONTENT)
  async manageProduct(
    @Body() dto: CharacterManageProductDto
  ){
    await this.characterService.handleManageProduct(dto);
  }
}
