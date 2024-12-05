import { Product } from "src/module/product/entities/product";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Serie } from "./serie";

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  shortDescription: string

  @Column()
  image: string

  // Relations
  @OneToMany(() => Product, (p)=> p.character)
  products?: Product[]

  @ManyToOne(()=> Serie, (s) => s.characters)
  serie?: Serie
}