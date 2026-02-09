import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPlansService } from './study-plans.service';
import { StudyPlan } from './entities/study-plan.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StudyPlan])],
    providers: [StudyPlansService],
    exports: [StudyPlansService],
})
export class StudyPlansModule { }
