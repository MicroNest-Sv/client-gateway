import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { appConfig } from '@src/config';
import { NATS_SERVICE } from '@src/config/services';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NATS_SERVICE,
        inject: [appConfig.KEY],
        useFactory: (config: ConfigType<typeof appConfig>) => ({
          transport: Transport.NATS,
          options: {
            servers: config.natsServers,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NatsModule {}
