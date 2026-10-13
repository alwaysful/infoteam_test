import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode!: number;

  @ApiProperty({ example: '글 없음' })
  message!: string;

  @ApiPropertyOptional({ example: 'Not Found' })
  error?: string;
}
