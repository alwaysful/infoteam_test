import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '공지' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
