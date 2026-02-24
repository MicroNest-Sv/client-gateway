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

import { PaginationDto } from '@src/common';

import { PRODUCT_SERVICE } from './config';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsClient
      .send({ cmd: 'create_product' }, createProductDto)
      .pipe(
        catchError((error: string | object) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsClient
      .send({ cmd: 'get_all_products' }, paginationDto)
      .pipe(
        catchError((error: string | object) => {
          throw new RpcException(error);
        }),
      );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'get_product_by_id' }, { id }).pipe(
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
    return this.productsClient
      .send({ cmd: 'update_product' }, { id, ...updateProductDto })
      .pipe(
        catchError((error: string | object) => {
          throw new RpcException(error);
        }),
      );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }
}
