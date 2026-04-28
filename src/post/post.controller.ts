import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto.post/create-post.dto';
import { UpdatePostDto } from './dto.post/update-post.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';


@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  // 전체 조회
  @Get()
  @ApiOperation({ summary: '전체 게시글 조회' })
  getPosts() {
    return this.service.getPosts();
  }

  // ID 조회
  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.service.getPostById(+id);
  }

  // userId 조회
  @Get('/user')
  getByUser(@Query('userId') userId: string) {
    return this.service.getPostsByUserId(+userId);
  }

  // 생성
  @Post()
  create(@Body() dto: CreatePostDto) {
    return this.service.createPost(dto);
  }

  // 수정
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.service.updatePost(+id, dto);
  }

  // 삭제
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.deletePost(+id);
  }
}

@UseGuards(JwtGuard)
@Post()
create(@Body() dto) {
  return this.service.createPost(dto);
}