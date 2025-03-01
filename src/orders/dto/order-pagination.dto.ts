import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common';
import { OrderStatus, OrderStatusList } from '../enums/order.enum';

export class OrderPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `status must be a valid enum value: ${OrderStatusList.join(', ')}`,
  })
  status: OrderStatus;
}
