import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto_post/create.post.dto';
import { UpdatePostDto } from './dto_post/update.post.dto';

@Injectable()
export class PostService {
  constructor(private readonly repo: PostRepository) {}

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
  getPostsByUserId(userId: number) {
    return this.repo.findByUserId(userId);
  }

  // 생성
  createPost(dto: CreatePostDto) {
    return this.repo.create(dto);
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