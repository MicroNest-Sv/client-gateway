import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

interface RpcError {
  status: number;
  message: string | string[];
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
    if (typeof error !== 'object' || error === null) return false;
    if (!('status' in error) || !('message' in error)) return false;

    const { message } = error as RpcError;
    return typeof message === 'string' || Array.isArray(message);
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
