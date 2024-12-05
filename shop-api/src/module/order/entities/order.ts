import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item";
import { TransbankOrderPayment } from "../../external/transbank/entities/transbank-order-payment";
import { PaymentProvider } from "../enums/PaymentProvider.enum";
import { Client } from "./client";
import { OrderStatus } from "../enums/OrderStatus";
import { User } from "src/module/user/entities/user";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  paymentProvider: PaymentProvider;

  @Column()
  value: number;

  // Optional
  @Column({ nullable: true })
  token: string;

  // Defaults
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.WAITING
  })
  status: OrderStatus;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date

  // Relations
  @OneToMany(() => OrderItem, (o) => o.order, { cascade: true })
  items?: OrderItem[];

  @OneToOne(() => Client, (c)=> c.order , { cascade: true })
  client?: Client

  @OneToOne(() => TransbankOrderPayment, (t) => t.order)
  transbankOrderPayment?: TransbankOrderPayment;

  @ManyToOne(()=> User, (u) => u.orders)
  user?: User
}
