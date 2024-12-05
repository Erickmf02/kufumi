import { Order } from "src/module/order/entities/order";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  name: string

  @Column()
  username: string

  // Defaults
  @CreateDateColumn({
    type: 'timestamp'
  })
  createdAt: Date

  // Relations
  @OneToMany(() => Order, (o)=> o.user)
  orders?: Order[]
}