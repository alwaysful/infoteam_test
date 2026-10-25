import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Post } from '@prisma/client';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotificationService } from '../notification/notification.service';
import { PostResponseDto } from './dto/post-response.dto';
import { MyPostsResponseDto } from './dto/my-posts-response.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    private readonly repo: PostRepository,
    private readonly notificationService: NotificationService,
  ) {}

  // 조회 후 없으면 예외 (get or throw)
  private async getPostOrThrow(id: number): Promise<Post> {
    const post = await this.repo.findById(id);
    if (!post) throw new NotFoundException('글 없음');
    return post;
  }

  // 작성자 본인만 수정/삭제 가능
  private assertOwner(post: Post, userId: string): void {
    if (post.userId !== userId) {
      throw new ForbiddenException(
        '본인이 작성한 글만 수정/삭제할 수 있습니다.',
      );
    }
  }

  // 전체 조회 (userId가 있으면 해당 유저의 글만)
  async getPosts(userId?: string): Promise<PostResponseDto[]> {
    const posts = await this.repo.findAll(userId);
    return posts.map((post) => PostResponseDto.from(post));
  }

  // ID 조회
  async getPostById(id: number): Promise<PostResponseDto> {
    const post = await this.getPostOrThrow(id);
    return PostResponseDto.from(post);
  }

  // 본인 글 목록 페이지네이션 조회
  getMyPosts(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<MyPostsResponseDto> {
    return this.repo.findMyPostsPaginated(userId, page, limit);
  }

  // 생성 (작성자는 토큰의 userId)
  async createPost(
    userId: string,
    dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    const post = await this.repo.create({
      title: dto.title,
      content: dto.content,
      categoryId: dto.categoryId,
      userId,
    });
    // 알림 실패가 글 생성 응답에 영향을 주지 않도록 기다리지 않되, 에러는 반드시 처리
    this.notificationService
      .sendNotifications(post.categoryId)
      .catch((error: unknown) => {
        this.logger.error(
          '알림 전송 실패',
          error instanceof Error ? error.stack : String(error),
        );
      });
    return PostResponseDto.from(post);
  }

  // 부분 수정 (PATCH)
  async updatePost(
    id: number,
    userId: string,
    dto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const data = {
      title: dto.title,
      content: dto.content,
      categoryId: dto.categoryId,
    };
    if (Object.values(data).every((value) => value === undefined)) {
      throw new BadRequestException('수정할 항목이 없습니다.');
    }

    const post = await this.getPostOrThrow(id);
    this.assertOwner(post, userId);

    const updated = await this.repo.update(id, data);
    return PostResponseDto.from(updated);
  }

  // 삭제
  async deletePost(id: number, userId: string): Promise<PostResponseDto> {
    const post = await this.getPostOrThrow(id);
    this.assertOwner(post, userId);

    const deleted = await this.repo.delete(id);
    return PostResponseDto.from(deleted);
  }
}
