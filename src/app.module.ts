import { Module } from '@nestjs/common';
import { AppController } from './app.controller.spec';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { PostModule } from './post/post.module';

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