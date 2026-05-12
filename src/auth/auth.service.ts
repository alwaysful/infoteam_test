import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(email: string, password: string, username?: string) {
    const hashed = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        provider: 'local',
      },
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // nullable 대응
    if (!user.password) {
      throw new UnauthorizedException('OAuth account');
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password, // 여기서 이제 string 보장됨
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return this.generateJwt(user);
  }

  async oauthLogin(oauthUser: any) {
    let user = await this.prisma.user.findFirst({
      where: {
        provider: oauthUser.provider,
        providerId: oauthUser.providerId,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: oauthUser.email,
          provider: oauthUser.provider,
          providerId: oauthUser.providerId,
        },
      });
    }

    return this.generateJwt(user);
  }

  private generateJwt(user: any) {
    return {
      accessToken: this.jwt.sign({
        userId: user.id,
        email: user.email,
      }),
    };
  }
}