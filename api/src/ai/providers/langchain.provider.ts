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
        // Define the schema for topics response - allow slight variance
        const topicsSchema = z.object({
            topics: z.array(z.string()).min(15).max(25).describe('Array of approximately 20 distinct topics'),
        });

        const parser = StructuredOutputParser.fromZodSchema(topicsSchema);

        const promptTemplate = PromptTemplate.fromTemplate(
            `Generate a list of exactly 20 distinct sub-topics, concepts, or skills for learning "{subject}" at a "{level}" level.
      
{format_instructions}

IMPORTANT: Provide exactly 20 topics - no more, no less.
Ensure each topic is specific, actionable, and relevant to the subject matter.`,
        );

        // Format the prompt
        const formattedPrompt = await promptTemplate.format({
            subject: prompt,
            level,
            format_instructions: parser.getFormatInstructions(),
        });

        // Invoke the model to get raw response with metadata
        const response = await this.model.invoke(formattedPrompt);

        // Extract token usage from response metadata
        const tokensUsed = this.extractTokenUsage(response);

        // Parse the response content
        const result = await parser.parse(response.content as string);

        // Normalize to exactly 20 topics
        let normalizedTopics = result.topics;
        if (normalizedTopics.length > 20) {
            // Take first 20 if too many
            normalizedTopics = normalizedTopics.slice(0, 20);
        } else if (normalizedTopics.length < 20) {
            // Pad with generic topics if too few (shouldn't happen often)
            const needed = 20 - normalizedTopics.length;
            for (let i = 0; i < needed; i++) {
                normalizedTopics.push(`Additional Topic ${i + 1}`);
            }
        }

        return { topics: normalizedTopics, tokensUsed };
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

        // Format the prompt
        const formattedPrompt = await promptTemplate.format({
            subject: prompt,
            level,
            topicsInstruction,
            format_instructions: parser.getFormatInstructions(),
        });

        // Invoke the model to get raw response with metadata
        const response = await this.model.invoke(formattedPrompt);

        // Extract token usage from response metadata
        const tokensUsed = this.extractTokenUsage(response);

        // Parse the response content
        const result = await parser.parse(response.content as string);

        return { ...result, tokensUsed };
    }

    /**
     * Extract actual token usage from Groq API response metadata
     */
    private extractTokenUsage(response: any): number {
        try {
            // Groq returns token usage in response_metadata.usage
            const usage = response.response_metadata?.usage;
            if (usage && typeof usage.total_tokens === 'number') {
                return usage.total_tokens;
            }

            // Fallback: calculate from prompt_tokens and completion_tokens
            if (usage) {
                const promptTokens = usage.prompt_tokens || 0;
                const completionTokens = usage.completion_tokens || 0;
                return promptTokens + completionTokens;
            }

            // If no metadata available, return 0
            console.warn('Token usage metadata not found in response');
            return 0;
        } catch (error) {
            console.error('Error extracting token usage:', error);
            return 0;
        }
    }

    /**
     * Get the underlying LangChain model for advanced use cases
     */
    getModel(): ChatGroq {
        return this.model;
    }
}
