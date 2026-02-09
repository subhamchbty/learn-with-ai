import { IsString, IsOptional, IsArray } from 'class-validator';

export class GenerateTopicsDto {
  @IsString()
  prompt: string;

  @IsString()
  level: string;
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
