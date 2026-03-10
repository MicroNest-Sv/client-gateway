import { IsEnum, IsOptional } from 'class-validator';

import { PaginationQueryDto } from '@src/common/dtos';

import { OrderStatus } from '../enums';

export class OrderQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: `status must be a valid enum value: ${Object.values(OrderStatus).join(', ')}`,
  })
  status: OrderStatus;
}
