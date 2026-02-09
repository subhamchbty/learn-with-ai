import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyPlansService } from './study-plans.service';
import { StudyPlansController } from './study-plans.controller';
import { StudyPlan } from './entities/study-plan.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StudyPlan])],
    providers: [StudyPlansService],
    controllers: [StudyPlansController],
    exports: [StudyPlansService],
})
export class StudyPlansModule { }
