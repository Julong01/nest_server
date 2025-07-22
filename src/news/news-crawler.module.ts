import { Module } from '@nestjs/common';
import { NewsCrawlerService } from './news-crawler.service';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    NewsCrawlerService,
    { provide: 'PRISMA', useValue: new PrismaClient() },
  ],
})
export class NewsCrawlerModule {}
