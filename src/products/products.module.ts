import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PRODUCT_SERVICE, productsConfig } from './config';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ConfigModule.forFeature(productsConfig),
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: productsConfig().productsMicroserviceHost,
          port: productsConfig().productsMicroservicePort,
        },
      },
    ]),
  ],
})
export class ProductsModule {}
