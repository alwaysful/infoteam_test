import { Test, TestingModule } from '@nestjs/testing';
import { AppService, IPost } from './app.service';
import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
@Controller('posts')
export class AppController {
  constructor(private readonly appService: AppService) { }


  // 전체 조회
  @Get()
  getPosts(): IPost[] {
    return this.appService.getPosts();
  }

  // 글 작성
  @Post()
  createPost(@Body() body: { title: string; content: string; userid: number; postindex: number; }) {
    return this.appService.createPost(body);
  }

  // 글 수정
  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body() body: { title: string; content: string; userid: number; postindex: number; }
  ): IPost | { message: string; } {
    return this.appService.updatePost(Number(id), body);
  }

  // 글 삭제
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.appService.deletePost(Number(id));
  }
}
