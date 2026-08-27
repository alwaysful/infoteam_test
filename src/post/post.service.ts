import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto.post/create-post.dto';
import { UpdatePostDto } from './dto.post/update-post.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class PostService {
  constructor(
    private readonly repo: PostRepository,
    private readonly notificationService: NotificationService,
  ) {}

  // 전체 조회
  getPosts() {
    return this.repo.findAll();
  }

  // ID 조회
  async getPostById(id: number) {
    const post = await this.repo.findById(id);
    if (!post) throw new NotFoundException('글 없음');
    return post;
  }

  // userId 조회
  getPostsByUserId(userId: string) {
   return this.repo.findByUserId(userId); 
  }

  // 본인 글 목록 페이지네이션 조회
  getMyPosts(userId: string, page = 1, limit = 10) {
    return this.repo.findMyPostsPaginated(userId, page, limit);
  }

  // 생성
  async createPost(dto: CreatePostDto) {
    const post = await this.repo.create(dto);

    this.notificationService.sendNotifications(
      post.categoryId,
    );

    return post;
  }

  // 수정
  async updatePost(id: number, dto: UpdatePostDto) {
    await this.getPostById(id);
    return this.repo.update(id, dto);
  }

  // 삭제
  async deletePost(id: number) {
    await this.getPostById(id);
    return this.repo.delete(id);
  }
}