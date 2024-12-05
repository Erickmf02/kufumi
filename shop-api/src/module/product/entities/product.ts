import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "../../order/entities/order-item";
import { Character } from "src/module/character/entities/character";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  shortDescription: string
  
  @Column()
  value: number

  @Column()
  stock: number

  @Column()
  image: string

  @Column('text', { array: true })
  images: string[]

  // Default
  @Column({
    default: 0
  })
  purchases: number

  @Column({
    default: true
  })
  isActive: boolean

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date

  
  // Relations
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems?: OrderItem[];

  @ManyToOne(()=> Character)
  character?: Character
}