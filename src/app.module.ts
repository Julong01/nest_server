import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { NewsController } from './news/news.controller';
import { NewsService } from './news/news.service';
import { CommunityController } from './community/community.controller';
import { CommunityService } from './community/community.service';
import { CommentController } from './comment/comment.controller';
import { CommentService } from './comment/comment.service';
import { NewsCrawlerModule } from './news/news-crawler.module';

@Module({
  imports: [AuthModule, NewsCrawlerModule],
  controllers: [NewsController, CommunityController, CommentController],
  providers: [NewsService, CommunityService, CommentService],
})
export class AppModule {}
