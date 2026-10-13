import { ApiProperty } from '@nestjs/swagger';

export class CategoryStatsResponseDto {
  @ApiProperty({ example: 1 })
  categoryId!: number;

  @ApiProperty({ example: '공지' })
  categoryName!: string;

  @ApiProperty({ example: 12 })
  postCount!: number;

  @ApiProperty({ example: 5 })
  subscriberCount!: number;
}
