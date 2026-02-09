import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Session } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTopicsDto, GeneratePlanDto, RefineStudyPlanDto } from './dto/ai.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('generate-topics')
  @HttpCode(HttpStatus.OK)
  async generateTopics(@Body() dto: GenerateTopicsDto, @Session() session: any) {
    return this.aiService.generateTopics(dto, session?.userId);
  }

  @Post('generate-plan')
  @HttpCode(HttpStatus.OK)
  async generatePlan(@Body() dto: GeneratePlanDto, @Session() session: any) {
    return this.aiService.generatePlan(dto, session.userId);
  }

  @Post('refine-plan')
  @HttpCode(HttpStatus.OK)
  async refinePlan(@Body() dto: RefineStudyPlanDto, @Session() session: any) {
    return this.aiService.refineStudyPlan(dto, session.userId);
  }
}
