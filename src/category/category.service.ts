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
}