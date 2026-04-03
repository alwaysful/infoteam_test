import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.post.findMany();
  }

  findById(id: number) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  findByUserId(userId: number) {
    return this.prisma.post.findMany({ where: { userId } });
  }

  create(data: { title: string; content: string; userId: number }) {
    return this.prisma.post.create({ data });
  }

  update(id: number, data: { title: string; content: string }) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  delete(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
