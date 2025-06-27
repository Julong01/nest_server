import { Injectable } from '@nestjs/common';
import { PrismaClient, Comment as PrismaComment } from '@prisma/client';

const prisma = new PrismaClient();

type CommentTree = PrismaComment & { children: CommentTree[] };

@Injectable()
export class NewsService {
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
    const comments = await prisma.comment.findMany({
      where: { newsId: id },
      orderBy: { createdAt: 'asc' },
    });

    // 트리 구조로 변환
    function buildCommentTree(comments: PrismaComment[]): CommentTree[] {
      const map: { [id: number]: CommentTree } = {};
      const roots: CommentTree[] = [];
      comments.forEach(comment => {
        map[comment.id] = { ...comment, children: [] };
      });
      comments.forEach(comment => {
        if (comment.parentId) {
          map[comment.parentId]?.children.push(map[comment.id]);
        } else {
          roots.push(map[comment.id]);
        }
      });
      return roots;
    }

    const commentTree = buildCommentTree(comments);
    return { news, comments: commentTree };
  }

  async createComment(newsId: number, userId: string, content: string) {
    // Post가 newsId로 연결되어 있다고 가정하고, Post를 찾거나 생성
    let post = await prisma.post.findFirst({ where: { title: `news-${newsId}`, authorId: userId } });
    if (!post) {
      post = await prisma.post.create({
        data: {
          title: `news-${newsId}`,
          content: '',
          authorId: userId,
        },
      });
    }
    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        authorId: userId,
        content,
      },
    });
    return comment;
  }
} 