import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';

export class PostResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '제목' })
  title!: string;

  @ApiProperty({ example: '내용' })
  content!: string;

  @ApiProperty({ example: '3f2b8c1e-9a4d-4c55-8f0e-1b2a3c4d5e6f' })
  userId!: string;

  @ApiProperty({ example: 1 })
  categoryId!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;

  static from(post: Post): PostResponseDto {
    const dto = new PostResponseDto();
    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.userId = post.userId;
    dto.categoryId = post.categoryId;
    dto.createdAt = post.createdAt;
    dto.updatedAt = post.updatedAt;
    return dto;
  }
}
