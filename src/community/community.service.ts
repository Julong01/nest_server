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
      data: { authorId: userId, title, content, type: 'COMMUNITY' },
    });
  }

  async updatePost(
    id: number,
    userId: string,
    data: { title?: string; content?: string },
  ) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) throw new Error('권한이 없습니다.');
    return prisma.post.update({ where: { id }, data });
  }

  async deletePost(id: number, userId: string) {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) throw new Error('권한이 없습니다.');
    return prisma.post.delete({ where: { id } });
  }

  // 댓글 관련 메서드 완전 삭제
}
