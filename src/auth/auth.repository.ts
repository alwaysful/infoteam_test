import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // OAuth 계정 조회 (provider + sub)
  findByProvider(provider: string, sub: string) {
    return this.prisma.user.findFirst({ where: { provider, sub } });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }
}
