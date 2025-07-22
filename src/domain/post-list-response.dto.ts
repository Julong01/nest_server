import { ApiProperty } from '@nestjs/swagger';
import { PostDto } from './post.dto';

export class PostListResponseDto {
  @ApiProperty({ type: [PostDto] })
  items: PostDto[];

  @ApiProperty({ example: 1 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;
}
