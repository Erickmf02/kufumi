import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "../order/entities/order-item";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string
  
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
    default: true
  })
  isActive: boolean

  @Column({
    default: new Date()
  })
  createdAt: Date

  
  // Relations
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems?: OrderItem[];
}