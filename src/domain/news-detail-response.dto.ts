import { ApiProperty } from '@nestjs/swagger';
import { NewsDto } from './news.dto';
import { CommentDto } from './comment.dto';

export class NewsDetailResponseDto {
  @ApiProperty({ type: NewsDto })
  news: NewsDto;

  @ApiProperty({ type: [CommentDto], description: '댓글 트리' })
  comments: CommentDto[];
}
