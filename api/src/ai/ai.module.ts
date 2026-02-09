import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { StudyPlansModule } from '../study-plans/study-plans.module';
import { UsersModule } from '../users/users.module';
import { LangChainProvider } from './providers/langchain.provider';
import { AiRequestTrackingService } from './ai-request-tracking.service';
import { AiRequest } from './entities/ai-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiRequest]),
    StudyPlansModule,
    UsersModule,
  ],
  controllers: [AiController],
  providers: [AiService, LangChainProvider, AiRequestTrackingService],
})
export class AiModule { }
