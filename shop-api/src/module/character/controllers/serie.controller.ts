import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { SerieService } from "../services/serie.service";
import { CreateSerieDto } from "../dto/create-serie.dto";
import { SerieManageCharacterDto } from "../dto/serie-manage-character.dto";
import { ParsePositiveIntPipe } from "src/common/pipes/parse-positive-int.pipe";

@Controller("serie")
export class SerieController {
  constructor(private readonly serieService: SerieService) {}

  @Post()
  async create(@Body() dto: CreateSerieDto) {
    return await this.serieService.handleCreate(dto);
  }

  @Get(":id")
  async findById(@Param("id", ParsePositiveIntPipe) id: number) {
    return await this.serieService.handleFindById(id);
  }

  @Patch("manage/character")
  @HttpCode(HttpStatus.NO_CONTENT)
  async manageCharacter(@Body() dto: SerieManageCharacterDto) {
    await this.serieService.handleManageCharacter(dto);
  }
}
