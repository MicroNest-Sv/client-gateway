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
    return this.productsClient.send(
      { cmd: 'create_product' },
      createProductDto,
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'get_all_products' }, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: 'find-one-product' }, { id }),
    //   );
    //   return product;
    // } catch (error) {
    //   throw new RpcException(error);
    // }

    return this.productsClient.send({ cmd: 'get_product_by_id' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(
          typeof error === 'string' ? error : JSON.stringify(error),
        );
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
        catchError((error) => {
          throw new RpcException(
            typeof error === 'string' ? error : JSON.stringify(error),
          );
        }),
      );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(
          typeof error === 'string' ? error : JSON.stringify(error),
        );
      }),
    );
  }
}
