import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from '@src/config';
import { PaginationQueryDto } from '@src/common/dtos';

import { CreateOrderDto, OrderQueryDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.natsClient.send('createOrder', createOrderDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll(@Query() orderQueryDto: OrderQueryDto) {
    return this.natsClient.send('findAllOrders', orderQueryDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.natsClient.send('findOneOrder', { id }).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get(':status')
  findByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationQueryDto: PaginationQueryDto,
  ) {
    return this.natsClient
      .send('findAllOrders', {
        ...statusDto,
        ...paginationQueryDto,
      })
      .pipe(
        catchError((error: string | object) => {
          throw new RpcException(error);
        }),
      );
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.natsClient
      .send('changeOrderStatus', {
        id,
        ...statusDto,
      })
      .pipe(
        catchError((error: string | object) => {
          throw new RpcException(error);
        }),
      );
  }
}
