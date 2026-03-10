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

import { ORDER_SERVICE } from './config';
import { CreateOrderDto, OrderQueryDto, StatusDto } from './dto';
import { PaginationQueryDto } from '@src/common/dtos';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll(@Query() orderQueryDto: OrderQueryDto) {
    return this.ordersClient.send('findAllOrders', orderQueryDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', { id }).pipe(
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
    return this.ordersClient
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
    return this.ordersClient
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
