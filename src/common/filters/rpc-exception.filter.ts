import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface RpcError {
  status: number;
  messages?: string[];
}

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const rpcError = exception.getError();

    const error: RpcError =
      typeof rpcError === 'object' && rpcError !== null && 'status' in rpcError
        ? (rpcError as RpcError)
        : {
            status: 503,
            messages: [this.extractMessage(rpcError)],
          };

    const status = error.status || 400;

    const messages = Array.isArray(error.messages)
      ? error.messages
      : [String(error.messages)];

    response.status(status).json({ status, messages });
  }

  private extractMessage(error: unknown): string {
    if (typeof error === 'string' && error.length > 0) return error;

    if (typeof error === 'object' && error !== null) {
      const obj = error as Record<string, unknown>;
      if (typeof obj.message === 'string' && obj.message.length > 0)
        return obj.message;

      const str = JSON.stringify(error);
      if (str !== '{}') return str;
    }

    return 'Service unavailable';
  }
}
