import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PostModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}