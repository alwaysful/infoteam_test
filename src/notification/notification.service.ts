import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../prisma/prisma.service';

import { forkJoin } from 'rxjs';
import { randomUUID } from 'crypto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  sendNotifications(categoryId: number) {
    const requests = this.prisma.subscription
      .findMany({
        where: {
          categoryId,
        },
      })
      .then((subscriptions) => {
        return subscriptions.map((subscription) => {
          const deviceId = randomUUID();

          return this.httpService.post(
            'http://localhost:8090/api/push',
            {
              deviceId,
            },
          );
        });
      });

    requests.then((observables) => {
      if (observables.length === 0) {
        return;
      }

      forkJoin(observables).subscribe({
        next: (responses) => {
          responses.forEach((response) => {
            const data = response.data;

            if (data.resultCode === 100) {
              console.log(
                `Push 성공: ${data.resultData.deviceId}`,
              );
            } else if (data.resultCode === -1) {
              console.error(
                `Push 실패: ${data.resultData.deviceId}`,
              );
            }
          });
        },

        error: (error) => {
          console.error(
            'Push Server 요청 중 오류 발생:',
            error,
          );
        },
      });
    });
  }
}