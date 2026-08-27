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

  // 카테고리 조회
   async getCategoryStats() {
    return this.prisma.$queryRaw<
      {
        categoryId: number;
        categoryName: string;
        postCount: number;
        subscriberCount: number;
      }[]
    >`
      SELECT
          c.id AS "categoryId",
          c.name AS "categoryName",
          COUNT(DISTINCT p.id)::int AS "postCount",
          COUNT(DISTINCT s."userId")::int AS "subscriberCount"
      FROM "Category" c
      LEFT JOIN "Post" p
          ON p."categoryId" = c.id
      LEFT JOIN "Subscription" s
          ON s."categoryId" = c.id
      GROUP BY c.id, c.name
      ORDER BY c.id;
    `;
   }
}