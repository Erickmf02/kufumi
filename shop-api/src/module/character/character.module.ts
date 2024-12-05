import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Character } from "./entities/character";
import { Serie } from "./entities/serie";
import { CharacterController } from "./controllers/character.controller";
import { CharacterService } from "./services/character.service";
import { SerieController } from "./controllers/serie.controller";
import { SerieService } from "./services/serie.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Character, Serie])
  ],
  controllers: [CharacterController, SerieController],
  providers: [CharacterService, SerieService],
  exports: [CharacterService, SerieService]
})
export class CharacterModule {}