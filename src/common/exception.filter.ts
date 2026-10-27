import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

interface ErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const body = this.toErrorBody(exception);

    const logMessage = `${request.method} ${request.originalUrl} -> ${body.statusCode} ${JSON.stringify(body.message)}`;
    if (body.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      // 예상하지 못한 에러는 스택까지 남긴다 (응답에는 노출하지 않는다)
      this.logger.error(
        logMessage,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(logMessage);
    }

    response.status(body.statusCode).json(body);
  }

  private toErrorBody(exception: unknown): ErrorBody {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const res = exception.getResponse();
      return typeof res === 'string'
        ? { statusCode, message: res }
        : { ...(res as Omit<ErrorBody, 'statusCode'>), statusCode };
    }

    // Prisma가 던지는 DB 에러를 HTTP 에러로 변환
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2025': // 수정/삭제 대상 없음
          return {
            statusCode: HttpStatus.NOT_FOUND,
            message: '대상을 찾을 수 없습니다.',
            error: 'Not Found',
          };
        case 'P2002': // unique 제약 위반
          return {
            statusCode: HttpStatus.CONFLICT,
            message: '이미 존재하는 값입니다.',
            error: 'Conflict',
          };
        case 'P2003': // 외래 키 제약 위반
          return {
            statusCode: HttpStatus.CONFLICT,
            message: '존재하지 않거나 다른 데이터가 참조 중인 대상입니다.',
            error: 'Conflict',
          };
      }
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: '잘못된 요청입니다.',
        error: 'Bad Request',
      };
    }

    // DB 연결 실패 등 Prisma 초기화 오류는 503으로 응답
    if (exception instanceof Prisma.PrismaClientInitializationError) {
      return {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: '데이터베이스에 연결할 수 없습니다.',
        error: 'Service Unavailable',
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    };
  }
}
