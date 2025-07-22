import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty({ example: 1, description: '댓글 고유 ID' })
  id: number;

  @ApiProperty({ example: '댓글 내용', description: '댓글 본문' })
  content: string;

  @ApiProperty({ example: 'user-uuid', description: '작성자 ID' })
  authorId: string;

  @ApiProperty({
    example: null,
    description: '부모 댓글 ID(대댓글일 경우)',
    required: false,
  })
  parentId?: number;

  @ApiProperty({ example: '2024-06-28T12:00:00Z', description: '작성일' })
  createdAt: string;

  @ApiProperty({
    type: [CommentDto],
    description: '대댓글 리스트',
    required: false,
  })
  children?: CommentDto[];
}
