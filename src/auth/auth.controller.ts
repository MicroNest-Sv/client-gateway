import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from '@src/config';

import { SignUpDto, SignInDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.natsClient.send('auth.sign-up', signUpDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.natsClient.send('auth.sign-in', signInDto).pipe(
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
