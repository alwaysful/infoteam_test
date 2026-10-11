import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({ orderBy: { id: 'asc' } });
  }

  create(name: string) {
    return this.prisma.category.create({ data: { name } });
  }

  delete(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }

  // 카테고리별 게시물 수 + 구독자 수 집계
  async findCategoryStats() {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        _count: {
          select: {
            posts: true,
            subscriptions: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      postCount: category._count.posts,
      subscriberCount: category._count.subscriptions,
    }));
  }

  // 본인 카테고리 구독 현황 + 카테고리별 작성한 글의 수
  async findMySubscriptionStats(userId: string) {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        subscriptions: {
          where: {
            userId,
          },
          select: {
            userId: true,
          },
        },
        posts: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      isSubscribed: category.subscriptions.length > 0,
      myPostCount: category.posts.length,
    }));
  }
}
