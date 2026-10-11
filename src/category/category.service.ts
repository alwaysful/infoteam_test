import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  // 카테고리 전체 조회
  async findAll() {
    return this.categoryRepository.findAll();
  }

  // 카테고리 추가
  async create(name: string) {
    return this.categoryRepository.create(name);
  }

  // 카테고리 삭제
  async remove(id: number) {
    return this.categoryRepository.delete(id);
  }

  // 카테고리별 게시물 수 + 구독자 수 집계 (하나의 API로 통합)
  async getCategoryStats() {
    return this.categoryRepository.findCategoryStats();
  }

  // 본인 카테고리 구독 현황 + 카테고리별 작성한 글의 수
  async getMySubscriptionStats(userId: string) {
    return this.categoryRepository.findMySubscriptionStats(userId);
  }
}
