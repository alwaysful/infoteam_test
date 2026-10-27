import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ description: '알림을 보낼 카테고리 ID', example: 1 })
  @IsInt()
  @Min(1)
  categoryId!: number;
}
