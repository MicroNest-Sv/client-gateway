import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { NATS_SERVICE } from '@src/config';

import { Public, User } from './decorators';
import { SignUpDto, SignInDto } from './dto';
import { type CurrentUser } from './interfaces';

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

  @Get('me')
  me(@User() user: CurrentUser) {
    return user;
  }
}
