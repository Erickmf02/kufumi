import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Serie } from "../entities/serie";
import { CreateSerieDto } from "../dto/create-serie.dto";
import { SerieManageAction, SerieManageCharacterDto } from "../dto/serie-manage-character.dto";
import { CharacterService } from "./character.service";

@Injectable()
export class SerieService {
  constructor(
    @InjectRepository(Serie)
    private readonly serieRepository: Repository<Serie>,
    private readonly characterService: CharacterService
  ) {}

  // Crear una nueva serie
  async handleCreate(dto: CreateSerieDto) {
    return await this.serieRepository.save(dto);
  }

  // Buscar una serie por su ID
  async handleFindById(id: number) {
    const serie = await this.serieRepository.findOne({
      where: { id },
      relations: ["characters"],
    });
    if (!serie) {
      throw new NotFoundException(`Serie con ID ${id} no encontrada.`);
    }
    return serie;
  }

  async handleManageCharacter(dto: SerieManageCharacterDto) {
    const { id, characterId, action } = dto;
  
    const serie = await this.serieRepository.findOne({
      where: { id },
      relations: ['characters'],
    });
  
    if (!serie) {
      throw new NotFoundException(`Serie con ID ${id} no encontrada.`);
    }
  
    const character = await this.characterService.findById(characterId);
  
    if (action === SerieManageAction.ADD) {
      if (serie.characters.some(c => c.id === character.id)) {
        throw new ConflictException(`El personaje con ID ${characterId} ya está asignado a la serie.`);
      }
  
      serie.characters = [character, ...(serie.characters || [])];
    } else if (action === SerieManageAction.REMOVE) {
      if (!serie.characters.some(c => c.id === character.id)) {
        throw new ConflictException(`El personaje con ID ${characterId} no está asignado a la serie.`);
      }
  
      serie.characters = (serie.characters || []).filter(c => c.id !== character.id);
    }
  
    await this.serieRepository.save(serie);
  }
  

  async findAll() {
    return await this.serieRepository.find();
  }

  async findById(id: number) {
    const serie = await this.serieRepository.findOne({ where: { id } });
    if (!serie) {
      throw new NotFoundException(`Serie con ID ${id} no encontrada.`);
    }
    return serie;
  }
}
