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
    const offset = (page - 1) * limit;

    const rows = await this.prisma.$queryRaw<
      {
        id: number;
        title: string;
        content: string;
        categoryId: number;
        createdAt: Date;
        totalCount: number;
      }[]
    >`
      SELECT
          p.id, p.title, p.content, p."categoryId", p."createdAt",
          COUNT(*) OVER()::int AS "totalCount"
      FROM "Post" p
      WHERE p."userId" = ${userId}::uuid
      ORDER BY p."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const totalCount = rows[0]?.totalCount ?? 0;
    const posts = rows.map(({ totalCount, ...rest }) => rest);

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