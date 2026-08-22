import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { NotificationService } from './notification.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    HttpModule,
    PrismaModule,
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
