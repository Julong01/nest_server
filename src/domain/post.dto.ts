import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ example: 1, description: '게시글 고유 ID' })
  id: number;

  @ApiProperty({ example: '게시글 제목', description: '게시글 제목' })
  title: string;

  @ApiProperty({ example: '게시글 본문', description: '게시글 본문' })
  content: string;

  @ApiProperty({ example: 'user-uuid', description: '작성자 ID' })
  authorId: string;

  @ApiProperty({ example: '2024-06-28T12:00:00Z', description: '작성일' })
  createdAt: string;
} 