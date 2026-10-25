import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ example: 'test_token' })
  accessToken!: string;
}
