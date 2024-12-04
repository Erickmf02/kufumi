import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Order } from "./entities/order";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrderDto } from "./order.dto";
import { ProductService } from "../product/product.service";
import { TransbankService } from "../external/transbank/transbank.service";
import { JwtService } from "@nestjs/jwt";
import { calculateOrderValue, generarCadenaAleatoria } from "./order.util";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { OrderStatus } from "./enums/OrderStatus";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
    private readonly transbankService: TransbankService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2
  ){}

  async create(dto: CreateOrderDto) {
    const { items: itemsDto, client, paymentProvider } = dto;
  
    const items = await this.productService.verifyStock(itemsDto);
  
    const order = await this.orderRepository.save({
      paymentProvider,
      token: generarCadenaAleatoria(16),
      client,
      items,
      value: calculateOrderValue(items)
    });

    const payout = await this.transbankService.create(order, `${process.env.CLIENT_API_URL}/order/payout`)

    return {
      payout,
      order: await this.orderRepository.findOne({
        where: { id: order.id },
        relations: ['items', 'items.product', 'client'],
      })
    }
  }
  

  async find(){
    return await this.orderRepository.find({relations: ['items', 'items.product', 'client']})
  }

  async handleFindOne(id: number, token?: string){
    // Falta añadir que los admin tengan permiso absoluto.
    if(!token){
      throw new UnauthorizedException('Token is missing')
    }
    const order = await this.findOne(id);
    if(order.token != token){
      throw new UnauthorizedException('Bad token')
    }
    return order;
  }

  async findOne(id: number) {
    const entity = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'client']
    })
    if(!entity) throw new NotFoundException();
    return entity
  }

  async completeTransaction(token: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        transbankOrderPayment: {
          token: token,
        },
      },
      relations: ['items', 'items.product', 'client', 'transbankOrderPayment'],
    });
  
    console.log('order', order);
    console.log('status before commit', await this.transbankService.status(token));
  
    try {
      await this.productService.verifyStock(
        order.items.map(i => ({
          id: i.product.id,
          stock: i.stock,
        }))
      );
  
      await this.handlePaymentSuccess(token, order);
    } catch (error) {
      await this.handlePaymentFailure(token, order);
    }
    return await this.findOne(order.id);
  }

  // Private methods
  
  private async handlePaymentSuccess(token: string, order: Order) {
    await this.transbankService.commit(token);
    // Mark order as paid
    order.status = OrderStatus.PAID;
    await this.orderRepository.save(order);
  
    // Emit event for the paid order
    await this.eventEmitter.emitAsync('order.paid', order);
  
    console.log('status after commit', await this.transbankService.status(token));
  }
  
  private async handlePaymentFailure(token: string, order: Order) {
    await this.transbankService.commit(token);
    // Refund the transaction due to stock failure
    await this.transbankService.refund(token, order.value);
  
    console.log('status after refund', await this.transbankService.status(token));
  }
}