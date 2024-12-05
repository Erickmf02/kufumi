import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Character } from "../entities/character";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCharacterDto } from "../dto/create-character.dto";
import { CharacterManageAction, CharacterManageProductDto } from "../dto/character-manage-product.dto";
import { ProductService } from "src/module/product/product.service";

@Injectable()
export class CharacterService {
  constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    private readonly productService: ProductService
  ){}

  // Controller handlers
  async handleCreate(dto: CreateCharacterDto){
    const {serieId, ...characterDto} = dto;

    const characterData = {
      ...characterDto,
      ...(serieId && { serie: { id: serieId } }),
    };

    return await this.characterRepository.save(characterData);
  }

  async handleFindById(id){
    const character = await this.characterRepository.findOne({ 
      where: { id },
      relations: ['products']
    });
    if(!character){
      throw new NotFoundException(`Personaje de ID ${id} no encontrado.`)
    }
    
    return character; 
  }


  async handleManageProduct(dto: CharacterManageProductDto) {
  const { id, productId, action } = dto;

  const character = await this.characterRepository.findOne({
    where: { id },
    relations: ['products'],
  });

  if (!character) {
    throw new NotFoundException(`Personaje de ID ${id} no encontrado.`);
  }

  const product = await this.productService.findById(productId);

  if (action === CharacterManageAction.ADD) {
    if (character.products.some(p => p.id === product.id)) {
      throw new ConflictException(`El producto con ID ${productId} ya está asignado al personaje.`);
    }

    character.products = [product, ...character.products];
  } else if (action === CharacterManageAction.REMOVE) {
    if (!character.products.some(p => p.id === product.id)) {
      throw new ConflictException(`El producto con ID ${productId} no está asignado al personaje.`);
    }

    character.products = character.products.filter(p => p.id !== product.id);
  }

  // Guardar los cambios
  await this.characterRepository.save(character);
}


  // Common methods
  async findAll(){
    return await this.characterRepository.find();
  }

  async findById(id: number){
    const character = await this.characterRepository.findOne({ where: { id } });
    if(!character){
      throw new NotFoundException(`Personaje de ID ${id} no encontrado.`)
    }
    return character; 
  }

  
}