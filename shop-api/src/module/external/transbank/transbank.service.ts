import { Injectable } from "@nestjs/common";
import { Environment, IntegrationApiKeys, IntegrationCommerceCodes, Options, WebpayPlus } from "transbank-sdk"
import { Repository } from "typeorm";
import { TransbankOrderPayment } from "./entities/transbank-order-payment";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/module/order/entities/order";

@Injectable()
export class TransbankService {
  constructor(
    @InjectRepository(TransbankOrderPayment)
    private readonly transbankOrderPaymentRepository: Repository<TransbankOrderPayment>,
    
  ) {
  }

  async create(order: Order, url: string): Promise<{token: string, url: string}>{
    const payout = await this.createWebPayPlusTransaction().create(order.id.toString(), '1', order.value, url)
    await this.transbankOrderPaymentRepository.save({
      order,
      token: payout.token
    })
    return payout;
  }

  async status(token: string): Promise<any>{
    return await this.createWebPayPlusTransaction().status(token);
  }

  async commit(token: string): Promise<any>{
    return await this.createWebPayPlusTransaction().commit(token);
  }

  async refund(token: string, amount: number): Promise<any>{
    return await this.createWebPayPlusTransaction().refund(token, amount);
  }


  private createWebPayPlusTransaction(){
    return new WebpayPlus.Transaction(new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration));
  }
}