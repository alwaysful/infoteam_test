import { Injectable } from '@nestjs/common';

export interface IPost {
  id: number;
  title: string;
  content: string;
}

@Injectable()
export class AppService {
  private posts: IPost[] = [];
  private id = 1;

  // 조회
  getPosts() {
    return this.posts;
  }

  // 생성
  createPost(body:  { title: string; content: string; userid: number; postindex: number}) {
    const newPost = {
      id: this.id++,
      ...body,
    };

    this.posts.push(newPost);
    return newPost;
  }

  // 수정
  updatePost(id: number, body: { title: string; content: string; userid: number; postindex: number}) {
    const post = this.posts.find(p => p.id === id);

    if (!post) return { message: '글 없음' };

    post.title = body.title;
    post.content = body.content;

    return post;
  }

  // 삭제
  deletePost(id: number) {
    this.posts = this.posts.filter(p => p.id !== id);
    return { message: '삭제 완료' };
  }
}