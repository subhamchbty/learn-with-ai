import { Controller, Get, UseGuards, Session, Param, Query } from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('study-plans')
@UseGuards(AuthGuard)
export class StudyPlansController {
    constructor(private readonly studyPlansService: StudyPlansService) { }

    @Get()
    async findAll(
        @Session() session: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 9;
        return this.studyPlansService.findAll(session.userId, pageNumber, limitNumber);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.studyPlansService.findOne(id);
    }
}
