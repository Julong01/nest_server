import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommunityService } from '../community/community.service';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from '../comment/comment.service';
import { ApiOperation, ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { PostDto } from '../domain/post.dto';
import { CommentDto } from '../domain/comment.dto';
import { ApiResponseDto } from '../domain/api-response.dto';
import { PostListResponseDto } from '../domain/post-list-response.dto';

@ApiTags('community')
@Controller('community')
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly commentService: CommentService,
  ) {}

  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiOkResponse({ type: PostListResponseDto })
  @Get('posts')
  async getPosts(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.communityService.getPosts(Number(page), Number(limit));
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiOkResponse({ type: ApiResponseDto })
  @Get('posts/:id')
  async getPost(@Param('id') id: string) {
    return this.communityService.getPost(Number(id));
  }

  @ApiOperation({ summary: '게시글 작성' })
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Post('posts')
  async createPost(
    @Body() body: { title: string; content: string },
    @Request() req,
  ) {
    return this.communityService.createPost(
      req.user.userId,
      body.title,
      body.content,
    );
  }

  @ApiOperation({ summary: '게시글 수정' })
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Put('posts/:id')
  async updatePost(
    @Param('id') id: string,
    @Body() body: { title?: string; content?: string },
    @Request() req,
  ) {
    return this.communityService.updatePost(Number(id), req.user.userId, body);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Delete('posts/:id')
  async deletePost(@Param('id') id: string, @Request() req) {
    return this.communityService.deletePost(Number(id), req.user.userId);
  }

  @ApiOperation({ summary: '게시글에 댓글 작성' })
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Post('posts/:id/comments')
  async createComment(
    @Param('id') id: string,
    @Body() body: { content: string; parentId?: number },
    @Request() req,
  ) {
    return this.commentService.createComment({
      postId: Number(id),
      authorId: req.user.userId,
      content: body.content,
      parentId: body.parentId,
    });
  }

  @ApiOperation({ summary: '게시글 댓글 목록 조회' })
  @ApiOkResponse({ type: ApiResponseDto })
  @Get('posts/:id/comments')
  async getComments(@Param('id') id: string) {
    return this.commentService.getComments({ postId: Number(id) });
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(AuthGuard('jwt'))
  @Put('comments/:id')
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
  @Delete('comments/:id')
  async deleteComment(@Param('id') id: string, @Request() req) {
    return this.commentService.deleteComment(Number(id), req.user.userId);
  }
}
