import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class CommunityService {
  async getPosts(page = 1, limit = 10) {
    const [items, total] = await Promise.all([
      prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.post.count(),
    ]);
    return { items, total, page, limit };
  }

  async getPost(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  async createPost(userId: string, title: string, content: string) {
    return prisma.post.create({
      data: { authorId: userId, title, content },
    });
  }

  async updatePost(id: number, userId: string, data: { title?: string; content?: string }) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) throw new Error('권한이 없습니다.');
    return prisma.post.update({ where: { id }, data });
  }

  async deletePost(id: number, userId: string) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) throw new Error('권한이 없습니다.');
    return prisma.post.delete({ where: { id } });
  }

  async createComment(postId: number, userId: string, content: string, parentId?: number) {
    return prisma.comment.create({
      data: { postId, authorId: userId, content, parentId },
    });
  }

  async getComments(postId: number) {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });
    // 트리 구조 변환은 필요시 추가
    return comments;
  }

  async updateComment(id: number, userId: string, content: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== userId) throw new Error('권한이 없습니다.');
    return prisma.comment.update({ where: { id }, data: { content } });
  }

  async deleteComment(id: number, userId: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== userId) throw new Error('권한이 없습니다.');
    return prisma.comment.delete({ where: { id } });
  }
} 