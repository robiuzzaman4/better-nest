import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { map, type Observable } from 'rxjs';
import { type APIResponse, isApiResponsePayload } from './api-response';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((value: unknown): APIResponse<unknown> => {
        if (isApiResponsePayload(value)) {
          return {
            success: true,
            status: response.statusCode,
            message: value.message,
            data: value.data,
          };
        }

        return {
          success: true,
          status: response.statusCode,
          message: 'Request successful',
          data: value ?? null,
        };
      }),
    );
  }
}
