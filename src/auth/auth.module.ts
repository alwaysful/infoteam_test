import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { InfoTeamStrategy } from './infoteam.strategy';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    // JwtStrategy(검증)와 같은 JWT_SECRET으로 서명
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // 예: 1h, 30m, 7d (단위 필수)
          expiresIn: config.getOrThrow<string>(
            'JWT_EXPIRES_IN',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),

    PassportModule,
  ],
  providers: [AuthService, AuthRepository, JwtStrategy, InfoTeamStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
