import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@prisma/client';

// password, sub 등 민감 필드는 의도적으로 제외
export class UserResponseDto {
  @ApiProperty({ example: '3f2b8c1e-9a4d-4c55-8f0e-1b2a3c4d5e6f' })
  id!: string;

  @ApiProperty({ example: 'user@gm.gist.ac.kr' })
  email!: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'hong' })
  username!: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'local' })
  provider!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  static from(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.username = user.username;
    dto.provider = user.provider;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
