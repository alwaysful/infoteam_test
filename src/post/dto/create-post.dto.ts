import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '제목' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: '내용' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  categoryId!: number;
}
