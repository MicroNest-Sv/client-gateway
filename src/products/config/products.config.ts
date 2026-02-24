import { registerAs } from '@nestjs/config';
import z from 'zod';

import { EnvValidationError } from '@src/common/exceptions';

const productsEnvSchema = z.object({
  PRODUCTS_MICROSERVICE_HOST: z.string().nonempty(),
  PRODUCTS_MICROSERVICE_PORT: z.coerce.number().default(3001),
});

type ProductsEnv = z.infer<typeof productsEnvSchema>;

export interface ProductsConfig {
  productsMicroserviceHost: string;
  productsMicroservicePort: number;
}

export default registerAs('products', (): ProductsConfig => {
  const parsed = productsEnvSchema.safeParse(process.env);

  if (!parsed.success) throw new EnvValidationError(parsed.error.issues);

  const env: ProductsEnv = parsed.data;

  return {
    productsMicroserviceHost: env.PRODUCTS_MICROSERVICE_HOST,
    productsMicroservicePort: env.PRODUCTS_MICROSERVICE_PORT,
  };
});
