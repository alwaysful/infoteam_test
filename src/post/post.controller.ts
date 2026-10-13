import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetMyPostsDto } from './dto/get-my-posts.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { PostResponseDto } from './dto/post-response.dto';
import { MyPostsResponseDto } from './dto/my-posts-response.dto';
import { ErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  // 전체 조회
  @Get()
  @ApiOperation({ summary: '전체 게시글 조회' })
  @ApiOkResponse({ type: PostResponseDto, isArray: true })
  getPosts() {
    return this.service.getPosts();
  }

  // 본인 글 목록 페이지네이션 조회
  @UseGuards(JwtGuard)
  @Get('me')
  @ApiOperation({ summary: '본인 게시글 목록 페이지네이션 조회' })
  @ApiOkResponse({ type: MyPostsResponseDto })
  getMyPosts(
    @Req() req: { user: { userId: string } },
    @Query() dto: GetMyPostsDto,
  ) {
    return this.service.getMyPosts(req.user.userId, dto.page, dto.limit);
  }

  // userId 조회
  @Get('/user')
  @ApiOkResponse({ type: PostResponseDto, isArray: true })
  getByUser(@Query('userId') userId: string) {
    return this.service.getPostsByUserId(userId);
  }

  // ID 조회
  @Get(':id')
  @ApiOkResponse({ type: PostResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  getPostById(@Param('id') id: string) {
    return this.service.getPostById(+id);
  }

  // 생성
  @UseGuards(JwtGuard)
  @Post()
  @ApiCreatedResponse({ type: PostResponseDto })
  create(@Body() dto: CreatePostDto) {
    return this.service.createPost(dto);
  }

  // 수정
  @UseGuards(JwtGuard)
  @Put(':id')
  @ApiOkResponse({ type: PostResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.service.updatePost(+id, dto);
  }

  // 삭제
  @UseGuards(JwtGuard)
  @Delete(':id')
  @ApiOkResponse({ type: PostResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  delete(@Param('id') id: string) {
    return this.service.deletePost(+id);
  }
}
