
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, originalUrl, query, body } = request;

    // Request Log
    const requestLog: any = {
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
      tap((responseBody) => {
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
