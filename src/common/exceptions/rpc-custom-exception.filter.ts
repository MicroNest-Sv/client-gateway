import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface RpcError {
  status: number;
  message: string;
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const rpcError = exception.getError();

    const error =
      typeof rpcError === 'string' ? this.tryParseJson(rpcError) : rpcError;

    if (this.isRpcError(error)) {
      const status = this.extractStatus(error);
      response.status(status).json({
        status,
        message: error.message,
      });
      return;
    }

    response.status(400).json({
      status: 400,
      message: rpcError,
    });
  }

  private isRpcError(error: unknown): error is RpcError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'message' in error &&
      typeof (error as RpcError).message === 'string'
    );
  }

  private extractStatus(error: RpcError): number {
    return isNaN(Number(error.status)) ? 400 : Number(error.status);
  }

  private tryParseJson(value: string): RpcError | string {
    try {
      return JSON.parse(value) as RpcError;
    } catch {
      return value;
    }
  }
}
