import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';

export class MyPostItemResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '제목' })
  title!: string;

  @ApiProperty({ example: '내용' })
  content!: string;

  @ApiProperty({ example: 1 })
  categoryId!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}

export class MyPostsResponseDto {
  @ApiProperty({ type: [MyPostItemResponseDto] })
  posts!: MyPostItemResponseDto[];

  @ApiProperty({ type: PaginationResponseDto })
  pagination!: PaginationResponseDto;
}
