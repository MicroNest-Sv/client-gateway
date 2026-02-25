import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface RpcError {
  status: number;
  messages?: string[];
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const rpcError = exception.getError();

    const error: RpcError =
      typeof rpcError === 'object' && rpcError !== null && 'status' in rpcError
        ? (rpcError as RpcError)
        : { status: 400, messages: [JSON.stringify(rpcError)] };

    const status = error.status || 400;

    const messages = Array.isArray(error.messages)
      ? error.messages
      : [String(error.messages)];

    response.status(status).json({ status, messages });
  }
}
