import {
  ConflictException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Prisma, User } from '@prisma/client';
import { OAuthUserDto } from './dto/oauthlogin.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserInfoDto } from './dto/get-userinfo.dto';
import { ConfigService } from '@nestjs/config';

function isUniqueViolation(e: unknown): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'
  );
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly idpUserInfoUrl: string;
  private readonly httpTimeoutMs: number;
  private readonly saltRounds: number;
  // 유저가 없을 때도 bcrypt 비교를 수행해 응답 시간 차이를 줄이기 위한 더미 해시
  private readonly dummyHash: string;

  constructor(
    private authRepository: AuthRepository,
    private jwt: JwtService,
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.idpUserInfoUrl = this.config.getOrThrow<string>('IDP_USERINFO_URL');
    this.httpTimeoutMs = Number(this.config.get('IDP_HTTP_TIMEOUT_MS') ?? 5000);
    this.saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS') ?? 10);
    this.dummyHash = bcrypt.hashSync('dummy-password', this.saltRounds);
  }
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  // 로컬 회원가입
  async signup(
    email: string,
    password: string,
    username?: string,
  ): Promise<UserResponseDto> {
    const hashed = await bcrypt.hash(password, this.saltRounds);

    try {
      const user = await this.authRepository.create({
        email: this.normalizeEmail(email),
        username,
        password: hashed,
        provider: 'local',
      });
      return UserResponseDto.from(user);
    } catch (e) {
      if (isUniqueViolation(e)) {
        throw new ConflictException('이미 사용 중인 이메일입니다.');
      }
      throw e;
    }
  }

  // 로컬 로그인
  async login(email: string, password: string): Promise<TokenResponseDto> {
    const user = await this.authRepository.findByEmail(
      this.normalizeEmail(email),
    );

    // 유저 없음 / OAuth 계정(비밀번호 없음) / 비밀번호 불일치를 구분하지 않는다
    const hashToCompare = user?.password ?? this.dummyHash;
    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!user || !user.password || !isMatch) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    return this.generateJwt(user);
  }

  // OAuth 로그인
  async oauthLogin(oauthUser: OAuthUserDto): Promise<TokenResponseDto> {
    const find = () =>
      this.authRepository.findByProvider(
        oauthUser.provider,
        oauthUser.providerId,
      );

    let user = await find();

    if (!user) {
      try {
        user = await this.authRepository.create({
          email: oauthUser.email
            ? this.normalizeEmail(oauthUser.email)
            : oauthUser.email,
          provider: oauthUser.provider,
          sub: oauthUser.providerId,
        });
      } catch (e) {
        if (!isUniqueViolation(e)) throw e;

        user = await find();

        if (!user) {
          throw new ConflictException(
            '이미 다른 방식으로 가입된 이메일입니다.',
          );
        }
      }
    }

    return this.generateJwt(user);
  }

  // IDP userInfo 호출 (공통)
  private async fetchUserInfo(accessToken: string): Promise<UserInfoDto> {
    if (!accessToken) {
      throw new UnauthorizedException('Invalid access token');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<UserInfoDto>(this.idpUserInfoUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
          timeout: this.httpTimeoutMs,
        }),
      );
      return response.data;
    } catch (error) {
      const status = (error as AxiosError).response?.status;

      // 토큰 자체가 잘못된 경우만 401
      if (status === 400 || status === 401 || status === 403) {
        throw new UnauthorizedException('Invalid access token');
      }

      // 타임아웃, 네트워크 오류, IDP 5xx 등
      this.logger.error(
        `IDP userInfo 호출 실패 (status=${status ?? 'none'}): ${
          (error as Error).message
        }`,
      );
      throw new ServiceUnavailableException('인증 서버와 통신할 수 없습니다.');
    }
  }

  async getUserInfo(accessToken: string) {
    return this.fetchUserInfo(accessToken);
  }

  // Access Token 검증: 무효면 false, IDP 장애는 예외 그대로 전달
  async validateAccessToken(accessToken: string): Promise<boolean> {
    try {
      await this.fetchUserInfo(accessToken);
      return true;
    } catch (e) {
      if (e instanceof UnauthorizedException) return false;
      throw e;
    }
  }

  // 우리 서버의 JWT 발급
  private generateJwt(user: User): TokenResponseDto {
    return {
      accessToken: this.jwt.sign({
        userId: user.id,
        email: user.email,
      }),
    };
  }
}
