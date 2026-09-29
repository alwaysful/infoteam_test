import { IsNotEmpty, IsString } from 'class-validator';

export class UserInfoDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
