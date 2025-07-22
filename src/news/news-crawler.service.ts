import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';
import { parseStringPromise } from 'xml2js';
import * as cheerio from 'cheerio';

@Injectable()
export class NewsCrawlerService {
  private readonly logger = new Logger(NewsCrawlerService.name);

  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  // 크롤링 주기: 매 1시간마다 (테스트 시 EVERY_MINUTE로 변경 가능)
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('뉴스 크롤링 시작');
    // 타겟 RSS URL (원하면 여러 개 배열로 관리 가능)
    const rssUrl = 'https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko';
    const res = await fetch(rssUrl);
    const xml = await res.text();

    // xml2js로 파싱
    const parsed = await parseStringPromise(xml);
    const items = parsed.rss.channel[0].item || [];

    for (const item of items) {
      const title = item.title?.[0] || '';
      const url = item.link?.[0] || '';
      const publishedAt = item.pubDate ? new Date(item.pubDate[0]) : new Date();
      let summary = '';
      let imageUrl = '';
      let sourceName = '';
      const sourceLogoUrl = '';

      // cheerio로 실제 뉴스 본문/썸네일 등 파싱 (간단 예시)
      try {
        const newsRes = await fetch(url);
        const html = await newsRes.text();
        const $: cheerio.CheerioAPI = cheerio.load(html);
        const desc = $('meta[name="description"]').attr('content');
        summary = typeof desc === 'string' ? desc : '';
        const img = $('meta[property="og:image"]').attr('content');
        imageUrl = typeof img === 'string' ? img : '';
        const site = $('meta[property="og:site_name"]').attr('content');
        sourceName = typeof site === 'string' ? site : '';
        // 필요시 로고 등 추가 파싱
      } catch {
        // 본문 파싱 실패는 무시
      }

      // 중복 체크 (url 기준)
      const exists = await this.prisma.post.findUnique({ where: { url } });
      if (exists) continue;

      // DB 저장
      try {
        await this.prisma.post.create({
          data: {
            type: 'NEWS',
            title,
            url,
            summary,
            imageUrl,
            sourceName,
            sourceLogoUrl,
            publishedAt,
          },
        });
      } catch {
        // 기타 에러 무시
      }
    }
    this.logger.log('뉴스 크롤링 완료');
  }
}
