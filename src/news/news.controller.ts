import { Controller, Get, Query, Param, Post, Body, UseGuards, Request } from '@nestjs/common';
import { NewsService } from '../news/news.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getNewsList(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.newsService.getNewsList(Number(page), Number(limit));
  }

  @Get(':id')
  async getNewsDetail(@Param('id') id: string) {
    return this.newsService.getNewsDetail(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/comments')
  async createComment(
    @Param('id') id: string,
    @Body() body: { content: string },
    @Request() req,
  ) {
    return this.newsService.createComment(Number(id), req.user.userId, body.content);
  }
} 