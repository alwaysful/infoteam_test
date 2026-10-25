import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

// 로그에 남기면 안 되는 필드 (비밀번호, 토큰 등)
const SENSITIVE_KEYS = new Set([
  'password',
  'accesstoken',
  'refreshtoken',
  'token',
  'authorization',
  'secret',
]);
const MASK = '***';

function maskSensitive(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(maskSensitive);
  }
  if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [
        key,
        SENSITIVE_KEYS.has(key.toLowerCase()) ? MASK : maskSensitive(inner),
      ]),
    );
  }
  return value;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

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
      requestLog.query = maskSensitive(query);
    }

    // POST, PUT, PATCH, DELETE 요청 → request body 기록
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      requestLog.body = maskSensitive(body);
    }

    this.logger.log({ type: 'request', ...requestLog });

    // Response Log
    return next.handle().pipe(
      tap((responseBody: unknown) => {
        this.logger.log({
          type: 'response',
          timestamp: new Date().toISOString(),
          method,
          url: originalUrl,
          status: response.statusCode,
          body: maskSensitive(responseBody),
        });
      }),
    );
  }
}
