import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateCommentDto {
  newsId?: number;
  postId?: number;
  authorId: string;
  content: string;
  parentId?: number;
}

@Injectable()
export class CommentService {
  async createComment(dto: CreateCommentDto) {
    return prisma.comment.create({
      data: dto,
    });
  }

  async getComments(filter: { newsId?: number; postId?: number }) {
    const comments = await prisma.comment.findMany({
      where: filter,
      orderBy: { createdAt: 'asc' },
    });
    // 트리 구조 변환
    type CommentTree = typeof comments[0] & { children: CommentTree[] };
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

  async updateComment(id: number, authorId: string, content: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== authorId) throw new Error('권한이 없습니다.');
    return prisma.comment.update({ where: { id }, data: { content } });
  }

  async deleteComment(id: number, authorId: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== authorId) throw new Error('권한이 없습니다.');
    return prisma.comment.delete({ where: { id } });
  }
} 