import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetCategoryStatsDto {
  @ApiProperty({ description: '카테고리 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  categoryId!: number;

  @ApiProperty({ description: '카테고리 이름', example: '여행' })
  @IsString()
  @IsNotEmpty()
  categoryName!: string;

  @ApiProperty({ description: '카테고리 게시글 수', example: 12 })
  @IsNumber()
  @IsNotEmpty()
  postCount!: number;

  @ApiProperty({ description: '카테고리 구독자 수', example: 8 })
  @IsNumber()
  @IsNotEmpty()
  subscriberCount!: number;
}
