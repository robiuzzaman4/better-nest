import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { isAPIError } from 'better-auth/api';
import type { APIResponse } from './api-response';

type ErrorBody = {
  message?: string | string[];
  error?: string;
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, message } = this.normalizeException(exception);

    response.status(status).json({
      success: false,
      status,
      message,
      data: null,
    } satisfies APIResponse<null>);
  }

  private normalizeException(exception: unknown) {
    if (isAPIError(exception)) {
      return {
        status: this.toHttpStatus(exception.status),
        message: exception.message,
      };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        return { status, message: exceptionResponse };
      }

      const body = exceptionResponse as ErrorBody;
      const message = Array.isArray(body.message)
        ? body.message.join(', ')
        : body.message || body.error || exception.message;

      return { status, message };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message || 'Internal server error',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }

  private toHttpStatus(status: number | string | undefined) {
    if (typeof status === 'number') {
      return status;
    }

    switch (status) {
      case 'BAD_REQUEST':
        return HttpStatus.BAD_REQUEST;
      case 'UNAUTHORIZED':
        return HttpStatus.UNAUTHORIZED;
      case 'FORBIDDEN':
        return HttpStatus.FORBIDDEN;
      case 'NOT_FOUND':
        return HttpStatus.NOT_FOUND;
      case 'CONFLICT':
        return HttpStatus.CONFLICT;
      case 'UNPROCESSABLE_ENTITY':
        return HttpStatus.UNPROCESSABLE_ENTITY;
      case 'TOO_MANY_REQUESTS':
        return HttpStatus.TOO_MANY_REQUESTS;
      case 'NOT_IMPLEMENTED':
        return HttpStatus.NOT_IMPLEMENTED;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
