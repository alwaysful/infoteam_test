import { Module } from '@nestjs/common';
import { AppController } from './app.controller.spec';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PostModule, AuthModule],
})
export class AppModule {}

@Module({
  imports: [PostModule],
})
export class AppModule {}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
