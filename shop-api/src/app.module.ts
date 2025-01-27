import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './module/product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './module/order/order.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TransbankModule } from './module/external/transbank/transbank.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CharacterModule } from './module/character/character.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [
    ProductModule,
    OrderModule,
    TransbankModule,
    CharacterModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET
    }),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: {expiresIn: "7d"}
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
