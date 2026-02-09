import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateTopicsDto, GeneratePlanDto } from './dto/ai.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('generate-topics')
  @HttpCode(HttpStatus.OK)
  async generateTopics(@Body() dto: GenerateTopicsDto) {
    return this.aiService.generateTopics(dto);
  }

  @Post('generate-plan')
  @HttpCode(HttpStatus.OK)
  async generatePlan(@Body() dto: GeneratePlanDto) {
    return this.aiService.generatePlan(dto);
  }
}
