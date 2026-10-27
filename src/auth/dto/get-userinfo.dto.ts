import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

// IDP userinfo 응답 형식
export class UserInfoDto {
  @ApiProperty({ example: 'provider-user-id-123' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ example: 'user@gm.gist.ac.kr' })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: '홍길동' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
