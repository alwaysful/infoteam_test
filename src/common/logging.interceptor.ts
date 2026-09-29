import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, originalUrl, query } = request;
    const body: unknown = request.body;

    // Request Log
    const requestLog: {
      timestamp: string;
      method: string;
      url: string;
      query?: unknown;
      body?: unknown;
    } = {
      timestamp: new Date().toISOString(),
      method,
      url: originalUrl,
    };

    // GET 요청 → query params 기록
    if (method === 'GET') {
      requestLog.query = query;
    }

    // POST, PUT, DELETE 요청 → request body 기록
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      requestLog.body = body;
    }

    console.log('[Request]', requestLog);

    // Response Log
    return next.handle().pipe(
      tap((responseBody: unknown) => {
        console.log('[Response]', {
          timestamp: new Date().toISOString(),
          method,
          url: originalUrl,
          status: response.statusCode,
          body: responseBody,
        });
      }),
    );
  }
}
