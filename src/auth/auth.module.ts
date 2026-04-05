import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { NatsModule } from '@src/transports';

import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';

@Module({
  controllers: [AuthController],
  imports: [NatsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
