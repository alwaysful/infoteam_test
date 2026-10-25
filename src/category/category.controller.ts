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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryStatsResponseDto } from './dto/category-stats-response.dto';
import { MyCategoryStatsResponseDto } from './dto/my-category-stats-response.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: '카테고리 전체 조회' })
  @ApiOkResponse({ type: CategoryResponseDto, isArray: true })
  findAll() {
    return this.categoryService.findAll();
  }

  // 카테고리별 게시물 수 + 구독자 수 집계
  @Get('stats')
  @ApiOperation({ summary: '카테고리별 게시물 수 + 구독자 수 조회' })
  @ApiOkResponse({ type: CategoryStatsResponseDto, isArray: true })
  async getCategoryStats() {
    return this.categoryService.getCategoryStats();
  }

  // 본인 카테고리 구독 현황 + 카테고리별 작성한 글의 수
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('me/stats')
  @ApiOperation({ summary: '본인 카테고리 구독 현황 + 작성한 글 수 조회' })
  @ApiOkResponse({ type: MyCategoryStatsResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async getMyStats(@Req() req: { user: { userId: string } }) {
    return this.categoryService.getMySubscriptionStats(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: '카테고리 생성' })
  @ApiCreatedResponse({ type: CategoryResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: '카테고리 삭제' })
  @ApiOkResponse({ type: CategoryResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({
    type: ErrorResponseDto,
    description: '게시글/구독이 참조 중인 카테고리',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
