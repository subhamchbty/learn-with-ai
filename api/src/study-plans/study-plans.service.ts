import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudyPlan } from './entities/study-plan.entity';

export interface CreateStudyPlanDto {
    title: string;
    description?: string;
    prompt: string;
    level: string;
    selectedTopics?: string[];
    schedule: any;
    userId: string;
}

@Injectable()
export class StudyPlansService {
    constructor(
        @InjectRepository(StudyPlan)
        private studyPlansRepository: Repository<StudyPlan>,
    ) { }

    async create(createStudyPlanDto: CreateStudyPlanDto): Promise<StudyPlan> {
        const studyPlan = this.studyPlansRepository.create(createStudyPlanDto);
        return await this.studyPlansRepository.save(studyPlan);
    }

    async findAll(
        userId: string,
        page: number = 1,
        limit: number = 9,
    ): Promise<{ data: StudyPlan[]; total: number; page: number; totalPages: number }> {
        const skip = (page - 1) * limit;

        const [data, total] = await this.studyPlansRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
        });

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(id: string): Promise<StudyPlan> {
        return await this.studyPlansRepository.findOne({ where: { id } });
    }

    async update(id: string, updateData: Partial<StudyPlan>): Promise<StudyPlan> {
        await this.studyPlansRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.studyPlansRepository.delete(id);
    }
}
