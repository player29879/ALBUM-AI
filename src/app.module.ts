import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { configService } from './config/config.service.js';
import { FileModule } from './file/file.module.js';
import { TaskService } from './task/task.service.js';
import OpenAI from 'openai';
import * as process from 'node:process';
import { EmbeddingService } from './remote/embedding.service';
import { HttpsProxyAgent } from 'https-proxy-agent';
import Anthropic from '@anthropic-ai/sdk';
import { ExtractImageService } from './remote/extract-image.service';
import { PgVectorStoreService } from './remote/pg-vector-store.service';
import { PageController } from './page/page.controller';

@Module({
  controllers: [PageController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ScheduleModule.forRoot(),
    FileModule,
  ],
  providers: [
    TaskService,
    EmbeddingService,
    ExtractImageService,
    PgVectorStoreService,
  ],
})
export class AppModule {}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  httpAgent: new HttpsProxyAgent(process.env.PROXY_URL),
});

export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  httpAgent: new HttpsProxyAgent(process.env.PROXY_URL),
});
