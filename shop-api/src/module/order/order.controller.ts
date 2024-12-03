import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Query, Redirect, UseInterceptors } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./order.dto";
import { ParsePositiveIntPipe } from "src/common/pipes/parse-positive-int.pipe";

@Controller('order')
export class OrderController{
  constructor(
    private readonly orderService: OrderService
  ) {}

  @Post()
  async create(
    @Body() dto: CreateOrderDto
  ) {
    return await this.orderService.create(dto);
  }

  @Get()
  async find(){
    return await this.orderService.find();
  }

  @Get('payout')
  @Redirect()
  async handlePayout(
    @Query() query
  ){
    const {token_ws, TBK_TOKEN, TBK_ORDEN_COMPRA, TBK_ID_SESION  } = query;
    // transaccion exitosa
    if(token_ws){

      const order = await this.orderService.completeTransaction(token_ws);
      return {
        url: `${process.env.CLIENT_URL}/voucher/${order.id}?token=${order.token}`
      }
    } else {
      return {
        url: process.env.CLIENT_URL
      }
    }
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOne(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Query('token') token?: string
  ){
    return await this.orderService.handleFindOne(id, token);
  }
}