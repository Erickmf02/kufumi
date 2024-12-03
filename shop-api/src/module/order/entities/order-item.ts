import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Product } from "../../product/product"
import { Order } from "./order"

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  stock: number

  @Column()
  value: number

  // Relations
  @ManyToOne(() => Order)
  order?: Order

  @ManyToOne(() => Product)
  product?: Product
}