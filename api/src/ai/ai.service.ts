import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GenerateTopicsDto, GeneratePlanDto, RefineStudyPlanDto } from './dto/ai.dto';
import { TopicsResponse, StudyPlan } from './interfaces/ai.interfaces';
import { StudyPlansService } from '../study-plans/study-plans.service';
import { UsersService } from '../users/users.service';
import { LangChainProvider } from './providers/langchain.provider';
import { AiRequestTrackingService } from './ai-request-tracking.service';
import { RequestType } from './entities/ai-request.entity';

@Injectable()
export class AiService {
  constructor(
    private langChainProvider: LangChainProvider,
    private studyPlansService: StudyPlansService,
    private usersService: UsersService,
    private aiRequestTrackingService: AiRequestTrackingService,
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

      // Log request asynchronously (fire and forget - happens after response)
      this.aiRequestTrackingService.logRequest({
        requestType: RequestType.GENERATE_TOPICS,
        prompt: dto.prompt,
        level: dto.level,
        tokensUsed: result.tokensUsed || 0,
        userId,
        metadata: {
          topicsCount: result.topics?.length || 0,
        },
      });

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

      // Log request asynchronously (fire and forget - happens after response)
      this.aiRequestTrackingService.logRequest({
        requestType: RequestType.GENERATE_PLAN,
        prompt: dto.prompt,
        level: dto.level,
        tokensUsed: data.tokensUsed || 0,
        userId,
        metadata: {
          selectedTopicsCount: dto.selectedTopics?.length || 0,
          scheduleItemsCount: data.schedule?.length || 0,
        },
      });

      return data;
    } catch (error) {
      console.error('Error generating plan:', error);
      throw new InternalServerErrorException('Failed to generate plan');
    }
  }

  async refineStudyPlan(dto: RefineStudyPlanDto, userId: string): Promise<StudyPlan> {
    try {
      // Get the existing study plan
      const existingPlan = await this.studyPlansService.findOne(dto.studyPlanId);

      if (!existingPlan) {
        throw new InternalServerErrorException('Study plan not found');
      }

      // Verify the user owns this study plan
      if (existingPlan.userId !== userId) {
        throw new InternalServerErrorException('Unauthorized access to study plan');
      }

      // Use LangChain to refine the plan with additional topics
      const refinedData = await this.langChainProvider.refinePlan(
        {
          title: existingPlan.title,
          description: existingPlan.description,
          prompt: existingPlan.prompt,
          level: existingPlan.level,
          selectedTopics: existingPlan.selectedTopics || [],
          schedule: existingPlan.schedule,
        },
        dto.additionalTopics,
      );

      // Track token usage
      if (refinedData.tokensUsed) {
        await this.usersService.incrementTokenUsage(userId, refinedData.tokensUsed);
      }

      // Update the study plan in the database
      await this.studyPlansService.update(dto.studyPlanId, {
        title: refinedData.title,
        description: refinedData.description,
        selectedTopics: [...(existingPlan.selectedTopics || []), ...dto.additionalTopics],
        schedule: refinedData.schedule,
      });

      // Log request asynchronously
      this.aiRequestTrackingService.logRequest({
        requestType: RequestType.REFINE_PLAN,
        prompt: existingPlan.prompt,
        level: existingPlan.level,
        tokensUsed: refinedData.tokensUsed || 0,
        userId,
        metadata: {
          additionalTopics: dto.additionalTopics,
          additionalTopicsCount: dto.additionalTopics.length,
          studyPlanId: dto.studyPlanId,
          originalTitle: existingPlan.title,
        },
      });

      return refinedData;
    } catch (error) {
      console.error('Error refining study plan:', error);
      throw new InternalServerErrorException('Failed to refine study plan');
    }
  }
}
