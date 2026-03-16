import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from '@src/config';
import { PaginationQueryDto } from '@src/common/dtos';

import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.natsClient
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError((error: string | object) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.natsClient
      .send({ cmd: 'get_all_products' }, paginationQueryDto)
      .pipe(
        catchError((error: string | object) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.natsClient.send({ cmd: 'get_product_by_id' }, { id }).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.natsClient
      .send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError((error: string | object) => {
          throw new RpcException(error);
        }),
      );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.natsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }
}
