import { Module } from '@nestjs/common';

import { NatsModule } from '@src/transports';

import { OrdersController } from './orders.controller';

@Module({
  controllers: [OrdersController],
  imports: [NatsModule],
})
export class OrdersModule {}
