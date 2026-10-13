import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotificationService } from '../notification/notification.service';
import { PostResponseDto } from './dto/post-response.dto';
import { MyPostsResponseDto } from './dto/my-posts-response.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly repo: PostRepository,
    private readonly notificationService: NotificationService,
  ) {}

  // 전체 조회
  async getPosts(): Promise<PostResponseDto[]> {
    const posts = await this.repo.findAll();
    return posts.map((post) => PostResponseDto.from(post));
  }

  // ID 조회
  async getPostById(id: number): Promise<PostResponseDto> {
    const post = await this.repo.findById(id);
    if (!post) throw new NotFoundException('글 없음');
    return PostResponseDto.from(post);
  }

  // userId 조회
  async getPostsByUserId(userId: string): Promise<PostResponseDto[]> {
    const posts = await this.repo.findByUserId(userId);
    return posts.map((post) => PostResponseDto.from(post));
  }

  // 본인 글 목록 페이지네이션 조회
  getMyPosts(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<MyPostsResponseDto> {
    return this.repo.findMyPostsPaginated(userId, page, limit);
  }

  // 생성
  async createPost(dto: CreatePostDto): Promise<PostResponseDto> {
    const post = await this.repo.create(dto);
    this.notificationService.sendNotifications(post.categoryId);
    return PostResponseDto.from(post);
  }

  // 수정
  async updatePost(id: number, dto: UpdatePostDto): Promise<PostResponseDto> {
    await this.getPostById(id);
    const post = await this.repo.update(id, dto);
    return PostResponseDto.from(post);
  }

  // 삭제
  async deletePost(id: number): Promise<PostResponseDto> {
    await this.getPostById(id);
    const post = await this.repo.delete(id);
    return PostResponseDto.from(post);
  }
}
