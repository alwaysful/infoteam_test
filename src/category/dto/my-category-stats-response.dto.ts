import { ApiProperty } from '@nestjs/swagger';

export class MyCategoryStatsResponseDto {
  @ApiProperty({ example: 1 })
  categoryId!: number;

  @ApiProperty({ example: '공지' })
  categoryName!: string;

  @ApiProperty({ example: true })
  isSubscribed!: boolean;

  @ApiProperty({ example: 3 })
  myPostCount!: number;
}
