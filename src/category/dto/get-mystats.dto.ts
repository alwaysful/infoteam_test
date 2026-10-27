import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetMyStatsDto {
  @ApiProperty({
    description: '카테고리 ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  categoryId!: number;

  @ApiProperty({
    description: '카테고리 이름',
    example: '여행',
  })
  @IsString()
  @IsNotEmpty()
  categoryName!: string;

  @ApiProperty({
    description: '사용자가 이 카테고리를 구독 중인지 여부',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isSubscribed!: boolean;

  @ApiProperty({
    description: '사용자가 해당 카테고리에 작성한 게시글 수',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  myPostCount!: number;
}
