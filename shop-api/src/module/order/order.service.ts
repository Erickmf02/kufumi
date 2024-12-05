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
import { hasMissingStock } from "../product/product.util";
import { ProductNotAvailableException } from "../product/errors/product-not-available.exception";
import { User } from "../user/entities/user";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly productService: ProductService,
    private readonly transbankService: TransbankService,
    private readonly eventEmitter: EventEmitter2
  ){}

    async handleCreate(dto: CreateOrderDto, user?: User) {
      const { items: itemsDto, client, paymentProvider } = dto;
    
      const productStockResponse = await this.productService.getStockAvailability(itemsDto);
      if(hasMissingStock(productStockResponse)){
        throw new ProductNotAvailableException(productStockResponse)
      }
    
      const items = productStockResponse.map(i => ({
        quantity: i.quantity,
        value: i.product.value,
        product: i.product
      }));

      const orderData = {
        paymentProvider,
        token: generarCadenaAleatoria(16),
        client,
        items,
        value: calculateOrderValue(items),
        user: undefined
      };
      
      if(user){
        orderData.user = user;
      }

      const order = await this.orderRepository.save(orderData);

      const payout = await this.transbankService.create(order, `${process.env.CLIENT_API_URL}/order/payout`)

      return {
        payout,
        order: await this.findOneById(order.id)
      }
    }
  

  async find(){
    return await this.orderRepository.find({relations: ['items', 'items.product', 'client']})
  }

  async handleFindOne(id: number, token?: string){
    // Falta añadir que los admin tengan permiso absoluto.
    if (!token) {
      throw new UnauthorizedException('Falta el token de autenticación.');
    }
    const order = await this.findOneById(id);
    if (order.token !== token) {
      throw new UnauthorizedException('El token proporcionado no es válido.');
    }
    return order;
  }

  async findOneById(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'items.product', 'client']
    });
    if (!order) throw new NotFoundException(`El pedido con ID ${id} no se encontró.`);
    return order;
  }

  async handlePayout(token: string): Promise<string> {
    const order = await this.orderRepository.findOne({
      where: { transbankOrderPayment: { token } },
      relations: ['items', 'items.product', 'client', 'transbankOrderPayment']
    });
    let url: string;
    await this.transbankService.commit(token);

    const productAvailabilityResponse = await this.productService.getStockAvailability(order.items);

    if(hasMissingStock(productAvailabilityResponse)){
      await this.transbankService.refund(token, order.value);
      order.status = OrderStatus.FAILED;

      url = `${process.env.CLIENT_URL}/voucher/${order.id}?token=${order.token}&error=No hay suficiente stock`;
    } else {
      order.status = OrderStatus.PAID;
      await this.eventEmitter.emitAsync('order.paid', order);
      
      url = `${process.env.CLIENT_URL}/voucher/${order.id}?token=${order.token}`;
    }
    await this.orderRepository.save(order);

    return url;
  }
}