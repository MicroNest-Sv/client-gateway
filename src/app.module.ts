import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig } from './config';
import { ProductsModule } from './products';
import { OrdersModule } from './orders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig],
    }),
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {}
