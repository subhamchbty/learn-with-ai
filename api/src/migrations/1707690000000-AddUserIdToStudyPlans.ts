import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToStudyPlans1707690000000 implements MigrationInterface {
    name = 'AddUserIdToStudyPlans1707690000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "study_plans" 
            ADD COLUMN "user_id" uuid NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "study_plans" 
            ADD CONSTRAINT "FK_study_plans_user_id" 
            FOREIGN KEY ("user_id") 
            REFERENCES "users"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_study_plans_user_id" 
            ON "study_plans" ("user_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_study_plans_user_id"`);
        await queryRunner.query(`ALTER TABLE "study_plans" DROP CONSTRAINT "FK_study_plans_user_id"`);
        await queryRunner.query(`ALTER TABLE "study_plans" DROP COLUMN "user_id"`);
    }
}
