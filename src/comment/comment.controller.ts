import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CommentDto } from '../domain/comment.dto';
import { ApiResponseDto } from '../domain/api-response.dto';

@ApiTags('comment')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 생성' })
  @ApiBody({
    schema: { example: { newsId: 1, postId: 2, content: '댓글', parentId: 1 } },
  })
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createComment(
    @Body()
    body: {
      newsId?: number;
      postId?: number;
      content: string;
      parentId?: number;
    },
    @Request() req,
  ) {
    return this.commentService.createComment({
      newsId: body.newsId,
      postId: body.postId,
      authorId: req.user.userId,
      content: body.content,
      parentId: body.parentId,
    });
  }

  @ApiOperation({ summary: '댓글 목록 조회' })
  @ApiOkResponse({ type: ApiResponseDto })
  @Get()
  async getComments(
    @Query('newsId') newsId?: number,
    @Query('postId') postId?: number,
  ) {
    return this.commentService.getComments({
      newsId: newsId ? Number(newsId) : undefined,
      postId: postId ? Number(postId) : undefined,
    });
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiBody({ schema: { example: { content: '수정된 댓글' } } })
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateComment(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Request() req,
  ) {
    return this.commentService.updateComment(
      Number(id),
      req.user.userId,
      body.content,
    );
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteComment(@Param('id') id: string, @Request() req) {
    return this.commentService.deleteComment(Number(id), req.user.userId);
  }
}
