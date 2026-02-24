import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { PRODUCT_SERVICE, productsConfig } from './config';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ConfigModule.forFeature(productsConfig),
    ClientsModule.registerAsync([
      {
        name: PRODUCT_SERVICE,
        imports: [ConfigModule.forFeature(productsConfig)],
        inject: [productsConfig.KEY],
        useFactory: (config: ConfigType<typeof productsConfig>) => ({
          transport: Transport.TCP,
          options: {
            host: config.productsMicroserviceHost,
            port: config.productsMicroservicePort,
          },
        }),
      },
    ]),
  ],
})
export class ProductsModule {}
