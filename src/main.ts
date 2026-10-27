import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/exception.filter';
import { LoggingInterceptor } from './common/logging.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Error handling (HttpException + Prisma 에러 변환)
  app.useGlobalFilters(new HttpExceptionFilter());

  // 요청/응답 로깅 (비밀번호, 토큰은 마스킹)
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 종료 시그널에서 onModuleDestroy(Prisma 연결 해제)가 실행되도록 설정
  app.enableShutdownHooks();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('게시판 API')
    .setDescription('CRUD API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.getOrThrow<number>('PORT'));
}

bootstrap().catch((error: unknown) => {
  new Logger('Bootstrap').error(
    '서버 시작 실패',
    error instanceof Error ? error.stack : String(error),
  );
  process.exit(1);
});
