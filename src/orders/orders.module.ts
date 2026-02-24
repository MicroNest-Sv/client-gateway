import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ORDER_SERVICE, ordersConfig } from './config';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    ConfigModule.forFeature(ordersConfig),
    ClientsModule.register([
      {
        name: ORDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: ordersConfig().ordersMicroserviceHost,
          port: ordersConfig().ordersMicroservicePort,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
