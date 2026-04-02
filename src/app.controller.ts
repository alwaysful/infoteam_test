import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { IPost } from './app.service';

@Controller('posts')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 전체 조회
  @Get()
  getPosts(): IPost[] {
    return this.appService.getPosts();
  }

  // 글 작성
  @Post()
  createPost(
    @Body() body: { title: string; content: string; userid: number; postindex: number}
  ): IPost | { message: string } {
    return this.appService.createPost(body);
  }

  // 글 수정
  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body() body: { title: string; content: string; userid: number; postindex: number}
  ): IPost | { message: string } {
    return this.appService.updatePost(+id, body);
  }

  // 글 삭제
  @Delete(':id')
  deletePost(@Param('id') id: string): { message: string } {
    return this.appService.deletePost(+id);
  }
}