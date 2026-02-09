import { Controller, Get, UseGuards, Session } from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('study-plans')
@UseGuards(AuthGuard)
export class StudyPlansController {
    constructor(private readonly studyPlansService: StudyPlansService) { }

    @Get()
    async findAll(@Session() session: any) {
        return this.studyPlansService.findAll(session.userId);
    }
}
