import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGroq } from '@langchain/groq';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

@Injectable()
export class LangChainProvider {
    private model: ChatGroq;

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GROQ_API_KEY');

        if (!apiKey) {
            throw new Error('GROQ_API_KEY is not configured');
        }

        this.model = new ChatGroq({
            apiKey,
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
        });
    }

    /**
     * Generate topics using LangChain with structured output
     */
    async generateTopics(prompt: string, level: string): Promise<{ topics: string[]; tokensUsed: number }> {
        // Define the schema for topics response
        const topicsSchema = z.object({
            topics: z.array(z.string()).length(20).describe('Array of exactly 20 distinct topics'),
        });

        const parser = StructuredOutputParser.fromZodSchema(topicsSchema);

        const promptTemplate = PromptTemplate.fromTemplate(
            `Generate a list of exactly 20 distinct sub-topics, concepts, or skills for learning "{subject}" at a "{level}" level.
      
{format_instructions}

Ensure each topic is specific, actionable, and relevant to the subject matter.`,
        );

        const chain = promptTemplate.pipe(this.model).pipe(parser);

        const result = await chain.invoke({
            subject: prompt,
            level,
            format_instructions: parser.getFormatInstructions(),
        });

        // Extract token usage from the last model response
        // Gemini API returns usage metadata in the response
        const tokensUsed = this.estimateTokens(prompt, level, JSON.stringify(result));

        return { ...result, tokensUsed };
    }

    /**
     * Generate study plan using LangChain with structured output
     */
    async generatePlan(
        prompt: string,
        level: string,
        selectedTopics: string[] = [],
    ): Promise<{
        title: string;
        description: string;
        schedule: Array<{
            period: string;
            objective: string;
            topics: Array<{
                title: string;
                lessons: Array<{
                    title: string;
                    description: string;
                }>;
            }>;
        }>;
        tokensUsed: number;
    }> {
        // Define the schema for study plan response
        const studyPlanSchema = z.object({
            title: z.string().describe('Compelling title for the study plan'),
            description: z.string().describe('Brief overview of the study plan'),
            schedule: z.array(
                z.object({
                    period: z.string().describe('Time period (e.g., Week 1, Module 1)'),
                    objective: z.string().describe('Learning objective for this period'),
                    topics: z.array(
                        z.object({
                            title: z.string().describe('Topic name'),
                            lessons: z.array(
                                z.object({
                                    title: z.string().describe('Lesson title'),
                                    description: z.string().describe('Brief lesson description'),
                                }),
                            ),
                        }),
                    ),
                }),
            ),
        });

        const parser = StructuredOutputParser.fromZodSchema(studyPlanSchema);

        const topicsInstruction = selectedTopics.length > 0
            ? `\n\nAdditionally, ensure these specific user-selected topics are integrated into the plan: ${selectedTopics.join(', ')}.`
            : '';

        const promptTemplate = PromptTemplate.fromTemplate(
            `Create a comprehensive structured study plan for "{subject}" ({level} level).

The plan MUST include all essential and fundamental topics required to master this subject at the specified level.{topicsInstruction}

Structure the plan by Timeline (e.g., Weeks or Modules).
For each time block, list the main Topics covered.
For each Topic, list specific Lesson titles with a brief description.

Do not generate full lesson content, just the structure.

{format_instructions}`,
        );

        const chain = promptTemplate.pipe(this.model).pipe(parser);

        const result = await chain.invoke({
            subject: prompt,
            level,
            topicsInstruction,
            format_instructions: parser.getFormatInstructions(),
        });
        // Extract token usage
        const tokensUsed = this.estimateTokens(prompt, level, JSON.stringify(result));

        return { ...result, tokensUsed };
    }

    /**
     * Estimate tokens used (rough approximation: 1 token ≈ 4 characters)
     * For more accuracy, integrate with the actual Groq API token counting
     */
    private estimateTokens(input: string, level: string, output: string): number {
        const inputTokens = Math.ceil((input.length + level.length) / 4);
        const outputTokens = Math.ceil(output.length / 4);
        return inputTokens + outputTokens;
    }

    /**
     * Get the underlying LangChain model for advanced use cases
     */
    getModel(): ChatGroq {
        return this.model;
    }
}
