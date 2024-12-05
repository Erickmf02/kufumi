import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Query, Redirect, Request, UseGuards, UseInterceptors } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./order.dto";
import { ParsePositiveIntPipe } from "src/common/pipes/parse-positive-int.pipe";
import { OptionalAuthGuard } from "src/common/guards/optional-auth.guard";
import { User } from "../user/entities/user";

@Controller('order')
export class OrderController{
  constructor(
    private readonly orderService: OrderService
  ) {}

  @Post()
  @UseGuards(OptionalAuthGuard)
  async create(
    @Body() dto: CreateOrderDto,
    @Request() req: any
  ) {
    const user: User | undefined = req.user;
    return await this.orderService.handleCreate(dto);
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
    let url: string;
    // transaccion exitosa
    if(token_ws){
      url = await this.orderService.handlePayout(token_ws);
    } else {
      url = process.env.CLIENT_URL
    }
    return { url }
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