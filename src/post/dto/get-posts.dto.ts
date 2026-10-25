import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class GetPostsDto {
  @ApiPropertyOptional({
    description: '작성자 ID. 없으면 전체 조회',
    format: 'uuid',
    example: '3f2b8c1e-9a4d-4c55-8f0e-1b2a3c4d5e6f',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;
}
