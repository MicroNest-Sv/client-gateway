import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { ORDER_SERVICE, ordersConfig } from './config';
import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
    ConfigModule.forFeature(ordersConfig),
    ClientsModule.registerAsync([
      {
        name: ORDER_SERVICE,
        imports: [ConfigModule.forFeature(ordersConfig)],
        inject: [ordersConfig.KEY],
        useFactory: (config: ConfigType<typeof ordersConfig>) => ({
          transport: Transport.TCP,
          options: {
            host: config.ordersMicroserviceHost,
            port: config.ordersMicroservicePort,
          },
        }),
      },
    ]),
  ],
})
export class OrdersModule {}
