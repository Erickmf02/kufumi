import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../../../order/entities/order";

@Entity()
export class TransbankOrderPayment {
  @PrimaryColumn()
  orderId: number

  @Column({ nullable: true })
  token?: string


  // Relations
  @OneToOne(()=> Order, { nullable: false })
  @JoinColumn()
  order?: Order
}