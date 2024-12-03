import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransbankOrderPayment } from "./entities/transbank-order-payment";
import { TransbankService } from "./transbank.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([TransbankOrderPayment])
  ],
  controllers: [],
  providers: [TransbankService],
  exports: [TransbankService]
})
export class TransbankModule {}