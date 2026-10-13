import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryStatsResponseDto } from './dto/category-stats-response.dto';
import { MyCategoryStatsResponseDto } from './dto/my-category-stats-response.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  // 카테고리 전체 조회
  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll();
    return categories.map((category) => CategoryResponseDto.from(category));
  }

  // 카테고리 추가
  async create(name: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.create(name);
    return CategoryResponseDto.from(category);
  }

  // 카테고리 삭제
  async remove(id: number): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.delete(id);
    return CategoryResponseDto.from(category);
  }

  // 카테고리별 게시물 수 + 구독자 수 집계 (하나의 API로 통합)
  async getCategoryStats(): Promise<CategoryStatsResponseDto[]> {
    return this.categoryRepository.findCategoryStats();
  }

  // 본인 카테고리 구독 현황 + 카테고리별 작성한 글의 수
  async getMySubscriptionStats(
    userId: string,
  ): Promise<MyCategoryStatsResponseDto[]> {
    return this.categoryRepository.findMySubscriptionStats(userId);
  }
}
