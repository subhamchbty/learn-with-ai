import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiRequest, RequestType } from './entities/ai-request.entity';

export interface LogRequestData {
    requestType: RequestType;
    prompt: string;
    level: string;
    tokensUsed: number;
    userId?: string;
    metadata?: any;
}

@Injectable()
export class AiRequestTrackingService {
    constructor(
        @InjectRepository(AiRequest)
        private aiRequestRepository: Repository<AiRequest>,
    ) { }

    /**
     * Log an AI request asynchronously (fire and forget)
     * This runs after the response is sent to the user
     */
    async logRequest(data: LogRequestData): Promise<void> {
        try {
            const aiRequest = this.aiRequestRepository.create({
                requestType: data.requestType,
                prompt: data.prompt,
                level: data.level,
                tokensUsed: data.tokensUsed,
                userId: data.userId,
                metadata: data.metadata,
            });

            // Fire and forget - don't wait for this to complete
            this.aiRequestRepository.save(aiRequest).catch((error) => {
                console.error('Failed to log AI request:', error);
            });
        } catch (error) {
            console.error('Error creating AI request log:', error);
        }
    }

    /**
     * Get request history for a user
     */
    async getUserRequestHistory(userId: string, limit = 50): Promise<AiRequest[]> {
        return this.aiRequestRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    /**
     * Get total requests and tokens used by a user
     */
    async getUserStats(userId: string): Promise<{
        totalRequests: number;
        totalTokens: number;
        requestsByType: Record<string, number>;
    }> {
        const requests = await this.aiRequestRepository.find({
            where: { userId },
            select: ['requestType', 'tokensUsed'],
        });

        const stats = {
            totalRequests: requests.length,
            totalTokens: requests.reduce((sum, r) => sum + r.tokensUsed, 0),
            requestsByType: {} as Record<string, number>,
        };

        requests.forEach((req) => {
            stats.requestsByType[req.requestType] =
                (stats.requestsByType[req.requestType] || 0) + 1;
        });

        return stats;
    }
}
