import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefinePlanRequestType1770620000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add the new 'refine_plan' value to the request_type enum
        await queryRunner.query(`
            ALTER TYPE "ai_requests_requesttype_enum" 
            ADD VALUE IF NOT EXISTS 'refine_plan'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Note: PostgreSQL doesn't support removing enum values directly
        // If you need to rollback, you would need to recreate the enum
        // For now, we'll leave this empty as removing enum values is complex
        console.log('Rollback not implemented - enum values cannot be easily removed in PostgreSQL');
    }
}
