import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  // userId가 없으면 전체, 있으면 해당 유저의 글만 (undefined 조건은 Prisma가 무시)
  findAll(userId?: string) {
    return this.prisma.post.findMany({ where: { userId } });
  }

  findById(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  // 본인 글 목록 페이지네이션
  async findMyPostsPaginated(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          content: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      this.prisma.post.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  create(data: Prisma.PostUncheckedCreateInput) {
    return this.prisma.post.create({ data });
  }

  // updatedAt은 Prisma(@updatedAt)가 자동으로 갱신
  update(id: number, data: Prisma.PostUncheckedUpdateInput) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
