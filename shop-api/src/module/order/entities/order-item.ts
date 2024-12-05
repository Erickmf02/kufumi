import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Product } from "../../product/entities/product"
import { Order } from "./order"

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  quantity: number

  @Column()
  value: number

  // Relations
  @ManyToOne(() => Order)
  order?: Order

  @ManyToOne(() => Product)
  product?: Product
}