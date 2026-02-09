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

    async findAll(): Promise<StudyPlan[]> {
        return await this.studyPlansRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<StudyPlan> {
        return await this.studyPlansRepository.findOne({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        await this.studyPlansRepository.delete(id);
    }
}
