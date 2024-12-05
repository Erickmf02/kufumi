import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Character } from "./character";

@Entity()
export class Serie {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  shortDescription: string

  @Column({ nullable: true })
  url?: string

  // Relations
  @OneToMany(() => Character, (c) => c.serie)
  characters?: Character[]
}