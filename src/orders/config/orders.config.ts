import { registerAs } from '@nestjs/config';
import z from 'zod';

import { EnvValidationError } from '@src/common/exceptions';

const ordersEnvSchema = z.object({
  ORDERS_MICROSERVICE_HOST: z.string().nonempty(),
  ORDERS_MICROSERVICE_PORT: z.coerce.number().default(3002),
});

type OrdersEnv = z.infer<typeof ordersEnvSchema>;

export interface OrdersConfig {
  ordersMicroserviceHost: string;
  ordersMicroservicePort: number;
}

export default registerAs('orders', (): OrdersConfig => {
  const parsed = ordersEnvSchema.safeParse(process.env);

  if (!parsed.success) throw new EnvValidationError(parsed.error.issues);

  const env: OrdersEnv = parsed.data;

  return {
    ordersMicroserviceHost: env.ORDERS_MICROSERVICE_HOST,
    ordersMicroservicePort: env.ORDERS_MICROSERVICE_PORT,
  };
});
