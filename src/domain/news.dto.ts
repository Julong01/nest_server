import { ApiProperty } from '@nestjs/swagger';

export class NewsDto {
  @ApiProperty({ example: 1, description: '뉴스 고유 ID' })
  id: number;

  @ApiProperty({ example: '뉴스 제목', description: '뉴스 제목' })
  title: string;

  @ApiProperty({ example: 'https://news.com/1', description: '뉴스 원본 URL' })
  url: string;

  @ApiProperty({ example: '뉴스 본문', description: '뉴스 본문 내용', required: false })
  content?: string;

  @ApiProperty({ example: '2024-06-28T12:00:00Z', description: '뉴스 발행일' })
  publishedAt: string;

  @ApiProperty({ example: '2024-06-28T12:00:00Z', description: '크롤링 시각' })
  crawledAt: string;

  @ApiProperty({ example: '뉴스 요약', description: '요약 내용', required: false })
  summary?: string;

  @ApiProperty({ example: 'https://image.com/1.jpg', description: '썸네일 이미지', required: false })
  imageUrl?: string;

  @ApiProperty({ example: '뉴스사', description: '언론사 이름', required: false })
  sourceName?: string;

  @ApiProperty({ example: 'https://logo.com/1.png', description: '언론사 로고', required: false })
  sourceLogoUrl?: string;
} 