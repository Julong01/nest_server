import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('posts')
  async getPosts(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.communityService.getPosts(Number(page), Number(limit));
  }

  @Get('posts/:id')
  async getPost(@Param('id') id: string) {
    return this.communityService.getPost(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('posts')
  async createPost(@Body() body: { title: string; content: string }, @Request() req) {
    return this.communityService.createPost(req.user.userId, body.title, body.content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('posts/:id')
  async updatePost(@Param('id') id: string, @Body() body: { title?: string; content?: string }, @Request() req) {
    return this.communityService.updatePost(Number(id), req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('posts/:id')
  async deletePost(@Param('id') id: string, @Request() req) {
    return this.communityService.deletePost(Number(id), req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('posts/:id/comments')
  async createComment(@Param('id') id: string, @Body() body: { content: string; parentId?: number }, @Request() req) {
    return this.communityService.createComment(Number(id), req.user.userId, body.content, body.parentId);
  }

  @Get('posts/:id/comments')
  async getComments(@Param('id') id: string) {
    return this.communityService.getComments(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('comments/:id')
  async updateComment(@Param('id') id: string, @Body() body: { content: string }, @Request() req) {
    return this.communityService.updateComment(Number(id), req.user.userId, body.content);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('comments/:id')
  async deleteComment(@Param('id') id: string, @Request() req) {
    return this.communityService.deleteComment(Number(id), req.user.userId);
  }
} 