import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentService } from '../comment/comment.service';

const prisma = new PrismaClient();

@Injectable()
export class NewsService {
  constructor(private readonly commentService: CommentService) {}

  async getNewsList(page = 1, limit = 10) {
    const [items, total] = await Promise.all([
      prisma.news.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.news.count(),
    ]);
    return { items, total, page, limit }; 
  }

  async getNewsDetail(id: number) {
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        reliabilityChecks: true,
      },
    });
    if (!news) return null;
    const comments = await this.commentService.getComments({ newsId: id });
    return { news, comments };
  }
} 