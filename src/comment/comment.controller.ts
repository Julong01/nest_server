import { Controller, Post, Get, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createComment(@Body() body: { newsId?: number; postId?: number; content: string; parentId?: number }, @Request() req) {
    return this.commentService.createComment({
      newsId: body.newsId,
      postId: body.postId,
      authorId: req.user.userId,
      content: body.content,
      parentId: body.parentId,
    });
  }

  @Get()
  async getComments(@Query('newsId') newsId?: number, @Query('postId') postId?: number) {
    return this.commentService.getComments({
      newsId: newsId ? Number(newsId) : undefined,
      postId: postId ? Number(postId) : undefined,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateComment(@Param('id') id: string, @Body() body: { content: string }, @Request() req) {
    return this.commentService.updateComment(Number(id), req.user.userId, body.content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteComment(@Param('id') id: string, @Request() req) {
    return this.commentService.deleteComment(Number(id), req.user.userId);
  }
} 