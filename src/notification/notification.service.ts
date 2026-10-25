import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';

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
          this.httpService.post(this.pushUrl, {
            deviceId,
          }),
        );
      }),
    );

    for (const result of results) {
      if (result.status === 'rejected') {
        this.logger.error('Push Server 요청 중 오류 발생', result.reason);
        continue;
      }

      const data = result.value.data;
      if (data.resultCode === 100) {
        this.logger.log(`Push 성공: ${data.resultData.deviceId}`);
      } else if (data.resultCode === -1) {
        this.logger.error(`Push 실패: ${data.resultData.deviceId}`);
      }
    }
  }
}
