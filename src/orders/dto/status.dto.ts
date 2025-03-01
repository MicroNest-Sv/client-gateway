import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enums/order.enum';

export class StatusDto {
  @IsOptional()
  @IsEnum(OrderStatusList, {
    message: `status must be a valid enum value: ${OrderStatusList.join(', ')}`,
  })
  status: OrderStatus;
}
