import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.post.findMany();
  }

  findById(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  findByUserId(userId: string) {
   return this.prisma.post.findMany({ where: { userId } });
  }

  // 본인 글 목록 페이지네이션
  async findMyPostsPaginated(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [posts, totalCount] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where: { userId } }),
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

  create(data: any) {
    return this.prisma.post.create({ data });
  }

  update(id: number, data: any) {
    return this.prisma.post.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}