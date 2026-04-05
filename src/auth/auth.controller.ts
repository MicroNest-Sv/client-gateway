import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from '@src/config';

import { RegisterUserDto, LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.natsClient.send('auth.register', registerUserDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.natsClient.send('auth.login', loginUserDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('verify')
  verify() {
    // TODO: extraer token del header Authorization
    return this.natsClient.send('auth.verify', {}).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }
}
