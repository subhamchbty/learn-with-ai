import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAiRequestsTable1770615855088 implements MigrationInterface {
    name = 'CreateAiRequestsTable1770615855088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."ai_requests_requesttype_enum" AS ENUM('generate_topics', 'generate_plan')`);
        await queryRunner.query(`CREATE TABLE "ai_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "requestType" "public"."ai_requests_requesttype_enum" NOT NULL, "prompt" text NOT NULL, "level" character varying NOT NULL, "tokens_used" integer NOT NULL, "metadata" jsonb, "user_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4998cd9c5fa6ec72b322504924" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_094c544faf3714b6eb4951dfb1" ON "ai_requests" ("requestType") `);
        await queryRunner.query(`CREATE INDEX "IDX_5b6adbac0b827c9fa24d0fe928" ON "ai_requests" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_12857a057578ec2960bc2c88f7" ON "ai_requests" ("created_at") `);
        await queryRunner.query(`ALTER TABLE "ai_requests" ADD CONSTRAINT "FK_5b6adbac0b827c9fa24d0fe9283" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ai_requests" DROP CONSTRAINT "FK_5b6adbac0b827c9fa24d0fe9283"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12857a057578ec2960bc2c88f7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5b6adbac0b827c9fa24d0fe928"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_094c544faf3714b6eb4951dfb1"`);
        await queryRunner.query(`DROP TABLE "ai_requests"`);
        await queryRunner.query(`DROP TYPE "public"."ai_requests_requesttype_enum"`);
    }

}
