import { Body, Controller, Get, Headers, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from '@src/config';

import { SignUpDto, SignInDto } from './dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(@Inject(NATS_SERVICE) private readonly natsClient: ClientProxy) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.natsClient.send('auth.sign-up', signUpDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Public()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.natsClient.send('auth.sign-in', signInDto).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }

  @Get('verify')
  verify(@Headers('authorization') authorization: string) {
    const token = authorization?.replace('Bearer ', '');

    return this.natsClient.send('auth.verify', { token }).pipe(
      catchError((error: string | object) => {
        throw new RpcException(error);
      }),
    );
  }
}
