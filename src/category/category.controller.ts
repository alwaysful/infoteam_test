import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './category.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  // 카테고리별 게시물 수 + 구독자 수 집계
  @Get('stats')
  async getCategoryStats() {
    return this.categoryService.getCategoryStats();
  }

  // 본인 카테고리 구독 현황 + 카테고리별 작성한 글의 수
  @UseGuards(JwtGuard)
  @Get('me/stats')
  async getMyStats(@Req() req) {
    return this.categoryService.getMySubscriptionStats(req.user.userId);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto.name);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}