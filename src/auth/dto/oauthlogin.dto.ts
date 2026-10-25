import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OAuthUserDto {
  @ApiProperty({ example: 'infoteam' })
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @ApiProperty({ example: 'provider-user-id-123' })
  @IsString()
  @IsNotEmpty()
  providerId!: string;

  @ApiProperty({ example: 'user@gm.gist.ac.kr' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
