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
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryStatsResponseDto } from './dto/category-stats-response.dto';
import { MyCategoryStatsResponseDto } from './dto/my-category-stats-response.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  findAll() {
    return this.categoryService.findAll();
  }

  // 카테고리별 게시물 수 + 구독자 수 집계
  @Get('stats')
  @ApiOkResponse({ type: CategoryStatsResponseDto, isArray: true })
  async getCategoryStats() {
    return this.categoryService.getCategoryStats();
  }

  // 본인 카테고리 구독 현황 + 카테고리별 작성한 글의 수
  @UseGuards(JwtGuard)
  @Get('me/stats')
  @ApiOkResponse({ type: MyCategoryStatsResponseDto, isArray: true })
  async getMyStats(@Req() req: { user: { userId: string } }) {
    return this.categoryService.getMySubscriptionStats(req.user.userId);
  }

  @Post()
  @ApiCreatedResponse({ type: CategoryResponseDto })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto.name);
  }

  @Delete(':id')
  @ApiOkResponse({ type: CategoryResponseDto })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
