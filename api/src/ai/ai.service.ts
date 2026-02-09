import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GenerateTopicsDto, GeneratePlanDto } from './dto/ai.dto';
import { TopicsResponse, StudyPlan } from './interfaces/ai.interfaces';
import { StudyPlansService } from '../study-plans/study-plans.service';
import { LangChainProvider } from './providers/langchain.provider';

@Injectable()
export class AiService {
  constructor(
    private langChainProvider: LangChainProvider,
    private studyPlansService: StudyPlansService,
  ) { }

  async generateTopics(dto: GenerateTopicsDto): Promise<TopicsResponse> {
    try {
      const result = await this.langChainProvider.generateTopics(
        dto.prompt,
        dto.level,
      );
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
