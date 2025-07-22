import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NewsService } from '../news/news.service';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from '../comment/comment.service';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { ApiResponseDto } from '../domain/api-response.dto';

// Request 타입을 커스텀으로 지정
interface JwtRequest extends Request {
  user: { userId: string };
}

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentService: CommentService,
  ) {}

  @ApiOperation({ summary: '뉴스 목록 조회' })
  @ApiOkResponse({ type: ApiResponseDto })
  @Get()
  async getNewsList(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.newsService.getNewsList(Number(page), Number(limit));
  }

  @ApiOperation({ summary: '뉴스 상세 조회' })
  @ApiOkResponse({ type: ApiResponseDto })
  @Get(':id')
  async getNewsDetail(@Param('id') id: string) {
    return this.newsService.getNewsDetail(Number(id));
  }

  @ApiOperation({ summary: '뉴스에 댓글 작성' })
  @ApiBody({ schema: { example: { content: '댓글 내용', parentId: 1 } } })
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  async createComment(
    @Param('id') id: string,
    @Body() body: { content: string; parentId?: number },
    @Request() req: JwtRequest,
  ) {
    return this.commentService.createComment({
      postId: Number(id),
      authorId: req.user.userId,
      content: body.content,
      parentId: body.parentId,
    });
  }

  @ApiOperation({ summary: '뉴스 댓글 목록 조회' })
  @ApiOkResponse({ type: ApiResponseDto })
  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.commentService.getComments({ postId: Number(id) });
  }
}
