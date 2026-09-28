import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class OAuthUserDto {
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @IsString()
  @IsNotEmpty()
  providerId!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
