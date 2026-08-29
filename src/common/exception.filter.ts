
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // 에러 로그
    console.error('[Exception]', {
      timestamp: new Date().toISOString(),
      method: request.method,
      url: request.originalUrl,
      status,
      message,
    });

    response.status(status).json(
      typeof message === 'string'
        ? {
            statusCode: status,
            message,
          }
        : message,
    );
  }
}
