import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

import { NATS_SERVICE } from '@src/config';

import { IS_PUBLIC_KEY } from '../decorators';
import { AuthResponse } from '../interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        messages: ['Token no proporcionado'],
      });
    }

    try {
      const { user } = await firstValueFrom<AuthResponse>(
        this.natsClient.send('auth.verify', { token }),
      );

      request['user'] = user;
    } catch (error) {
      if (error instanceof RpcException) throw error;

      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        messages: ['Token inválido o expirado'],
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
