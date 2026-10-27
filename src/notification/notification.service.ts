import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';

// Push Server 응답 형식
interface PushResponse {
  resultCode: number;
  resultData: { deviceId: string };
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly pushUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.pushUrl = `${this.config.getOrThrow<string>('PUSH_SERVER_URL')}/api/push`;
  }

  async sendNotifications(categoryId: number): Promise<void> {
    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        categoryId,
      },
    });

    if (subscriptions.length === 0) {
      return;
    }

    // 하나가 실패해도 나머지는 계속 전송되도록 allSettled 사용
    const results = await Promise.allSettled(
      subscriptions.map(() => {
        const deviceId = randomUUID();
        return firstValueFrom(
          this.httpService.post<PushResponse>(this.pushUrl, {
            deviceId,
          }),
        );
      }),
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        this.logger.error(
          'Push Server 요청 중 오류 발생',
          result.reason instanceof Error
            ? result.reason.stack
            : String(result.reason),
        );
        continue;
      }

      const { resultCode, resultData } = result.value.data;
      if (resultCode === 100) {
        this.logger.log(`Push 성공: ${resultData.deviceId}`);
      } else {
        this.logger.error(
          `Push 실패 (resultCode=${resultCode}): ${resultData.deviceId}`,
        );
      }
    }
  }
}
