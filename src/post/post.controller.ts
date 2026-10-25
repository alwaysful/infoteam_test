import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetMyPostsDto } from './dto/get-my-posts.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { PostResponseDto } from './dto/post-response.dto';
import { MyPostsResponseDto } from './dto/my-posts-response.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

type AuthRequest = { user: { userId: string } };

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  // 전체 조회 (?userId= 로 특정 유저의 글만 조회)
  @Get()
  @ApiOperation({ summary: '게시글 조회 (userId로 작성자 필터링 가능)' })
  @ApiOkResponse({ type: PostResponseDto, isArray: true })
  getPosts(@Query() dto: GetPostsDto): Promise<PostResponseDto[]> {
    return this.service.getPosts(dto.userId);
  }

  // 본인 글 목록 페이지네이션 조회
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('me')
  @ApiOperation({ summary: '본인 게시글 목록 페이지네이션 조회' })
  @ApiOkResponse({ type: MyPostsResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  getMyPosts(
    @Req() req: AuthRequest,
    @Query() dto: GetMyPostsDto,
  ): Promise<MyPostsResponseDto> {
    return this.service.getMyPosts(req.user.userId, dto.page, dto.limit);
  }

  // ID 조회
  @Get(':id')
  @ApiOperation({ summary: '게시글 단건 조회' })
  @ApiOkResponse({ type: PostResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  getPostById(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto> {
    return this.service.getPostById(id);
  }

  // 생성
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  @ApiOperation({ summary: '게시글 생성' })
  @ApiCreatedResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  create(
    @Req() req: AuthRequest,
    @Body() dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.service.createPost(req.user.userId, dto);
  }

  // 부분 수정
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  @ApiOperation({ summary: '게시글 부분 수정 (본인 글만)' })
  @ApiOkResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.service.updatePost(id, req.user.userId, dto);
  }

  // 삭제
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제 (본인 글만)' })
  @ApiOkResponse({ type: PostResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  delete(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PostResponseDto> {
    return this.service.deletePost(id, req.user.userId);
  }
}
