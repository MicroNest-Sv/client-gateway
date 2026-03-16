import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from './config';
import { ProductsModule } from './products';
import { OrdersModule } from './orders';
import { NatsModule } from './transports/nats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
    }),
    ProductsModule,
    OrdersModule,
    NatsModule,
  ],
})
export class AppModule {}
