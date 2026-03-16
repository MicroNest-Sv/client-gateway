import { Module } from '@nestjs/common';

import { NatsModule } from '@src/transports';

import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  imports: [NatsModule],
})
export class ProductsModule {}
