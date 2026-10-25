import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

// PATCH: 생성 DTO의 모든 필드를 선택값으로 (검증 규칙과 Swagger 문서 모두 상속)
export class UpdatePostDto extends PartialType(CreatePostDto) {}
