import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { OrderItem } from "./entities/order-item";
import { Client } from "./entities/client";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Client])
  ],
  controllers: [OrderController],
  exports: [OrderService],
  providers: [OrderService]
})
export class OrderModule {}