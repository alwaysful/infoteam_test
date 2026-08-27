import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // 카테고리 전체 조회
  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  // 카테고리 추가
  async create(name: string) {
    return this.prisma.category.create({
      data: {
        name,
      },
    });
  }

  // 카테고리 삭제
  async remove(id: number) {
    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }

  // 카테고리별 게시물 수 + 구독자 수 집계 (하나의 API로 통합)
  async getCategoryStats() {
    const categories = await this.prisma.category.findMany({
      orderBy: { id: 'asc' },
    });

    const [postCounts, subscriberCounts] = await Promise.all([
      this.prisma.post.groupBy({
        by: ['categoryId'],
        _count: { _all: true },
      }),
      this.prisma.subscription.groupBy({
        by: ['categoryId'],
        _count: { _all: true },
      }),
    ]);

    const postCountMap = new Map(
      postCounts.map((p) => [p.categoryId, p._count._all]),
    );
    const subscriberCountMap = new Map(
      subscriberCounts.map((s) => [s.categoryId, s._count._all]),
    );

    return categories.map((c) => ({
      categoryId: c.id,
      categoryName: c.name,
      postCount: postCountMap.get(c.id) ?? 0,
      subscriberCount: subscriberCountMap.get(c.id) ?? 0,
    }));
  }

  // 본인 카테고리 구독 현황 + 카테고리별 작성한 글의 수
  async getMySubscriptionStats(userId: string) {
    const categories = await this.prisma.category.findMany({
      orderBy: { id: 'asc' },
    });

    const [mySubscriptions, myPostCounts] = await Promise.all([
      this.prisma.subscription.findMany({
        where: { userId },
        select: { categoryId: true },
      }),
      this.prisma.post.groupBy({
        by: ['categoryId'],
        where: { userId },
        _count: { _all: true },
      }),
    ]);

    const subscribedSet = new Set(mySubscriptions.map((s) => s.categoryId));
    const myPostCountMap = new Map(
      myPostCounts.map((p) => [p.categoryId, p._count._all]),
    );

    return categories.map((c) => ({
      categoryId: c.id,
      categoryName: c.name,
      isSubscribed: subscribedSet.has(c.id),
      myPostCount: myPostCountMap.get(c.id) ?? 0,
    }));
  }
}