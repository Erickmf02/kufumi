import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Order } from "./order";

@Entity()
export class Client {
  @PrimaryColumn()
  orderId: number

  @Column()
  name: string

  @Column()
  rut: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string

  @Column()
  city: string

  @Column({ nullable: true })
  department: string

  // Relations
  @OneToOne(()=> Order, { nullable: false })
  @JoinColumn()
  order?: Order
}