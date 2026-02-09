import { IsString, IsOptional, IsArray } from 'class-validator';

export class GenerateTopicsDto {
  @IsString()
  prompt: string;

  @IsString()
  level: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  excludeTopics?: string[];
}

export class GeneratePlanDto {
  @IsString()
  prompt: string;

  @IsString()
  level: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedTopics?: string[];
}

export class RefineStudyPlanDto {
  @IsString()
  studyPlanId: string;

  @IsArray()
  @IsString({ each: true })
  additionalTopics: string[];
}
