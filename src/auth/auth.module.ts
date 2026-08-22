import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { InfoTeamStrategy } from './infoteam.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PrismaModule,

    HttpModule,

    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),

    PassportModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    InfoTeamStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}