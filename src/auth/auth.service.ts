import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly httpService: HttpService,
  ) {}

  // 기존 회원가입
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

  // 기존 로컬 로그인
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
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    return this.generateJwt(user);
  }

  // 기존 OAuth 로그인
  async oauthLogin(oauthUser: any) {
    let user = await this.prisma.user.findFirst({
      where: {
        provider: oauthUser.provider,
        sub: oauthUser.providerId,
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: oauthUser.email,
          provider: oauthUser.provider,
          sub: oauthUser.providerId,
        },
      });
    }

    return this.generateJwt(user);
  }

  // IDP의 /oauth/userInfo 호출
  async getUserInfo(accessToken: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          'https://api.idp.gistory.me/oauth/userInfo',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  // Access Token 검증
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          'https://api.idp.gistory.me/oauth/userInfo',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );

      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // 우리 서버의 JWT 발급
  private generateJwt(user: any) {
    return {
      accessToken: this.jwt.sign({
        userId: user.id,
        email: user.email,
      }),
    };
  }
}