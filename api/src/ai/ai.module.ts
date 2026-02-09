import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { StudyPlansModule } from '../study-plans/study-plans.module';
import { UsersModule } from '../users/users.module';
import { LangChainProvider } from './providers/langchain.provider';

@Module({
  imports: [StudyPlansModule, UsersModule],
  controllers: [AiController],
  providers: [AiService, LangChainProvider],
})
export class AiModule { }
