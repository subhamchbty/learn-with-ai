import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GenerateTopicsDto, GeneratePlanDto } from './dto/ai.dto';
import { TopicsResponse, StudyPlan } from './interfaces/ai.interfaces';
import { StudyPlansService } from '../study-plans/study-plans.service';
import { UsersService } from '../users/users.service';
import { LangChainProvider } from './providers/langchain.provider';

@Injectable()
export class AiService {
  constructor(
    private langChainProvider: LangChainProvider,
    private studyPlansService: StudyPlansService,
    private usersService: UsersService,
  ) { }

  async generateTopics(dto: GenerateTopicsDto, userId?: string): Promise<TopicsResponse> {
    try {
      const result = await this.langChainProvider.generateTopics(
        dto.prompt,
        dto.level,
      );

      // Track token usage if user is authenticated
      if (userId && result.tokensUsed) {
        await this.usersService.incrementTokenUsage(userId, result.tokensUsed);
      }

      return result;
    } catch (error) {
      console.error('Error generating topics:', error);
      throw new InternalServerErrorException('Failed to generate topics');
    }
  }

  async generatePlan(dto: GeneratePlanDto, userId: string): Promise<StudyPlan> {
    try {
      const data = await this.langChainProvider.generatePlan(
        dto.prompt,
        dto.level,
        dto.selectedTopics,
      );

      // Track token usage
      if (data.tokensUsed) {
        await this.usersService.incrementTokenUsage(userId, data.tokensUsed);
      }

      // Save the generated study plan to the database
      try {
        await this.studyPlansService.create({
          title: data.title,
          description: data.description,
          prompt: dto.prompt,
          level: dto.level,
          selectedTopics: dto.selectedTopics,
          schedule: data.schedule,
          userId,
        });
      } catch (dbError) {
        console.error('Error saving study plan to database:', dbError);
        // Continue and return the plan even if database save fails
      }

      return data;
    } catch (error) {
      console.error('Error generating plan:', error);
      throw new InternalServerErrorException('Failed to generate plan');
    }
  }
}
