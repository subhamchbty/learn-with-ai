import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateStudyPlansTable1707379200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'study_plans',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '500',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'prompt',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'level',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'selectedTopics',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'schedule',
                        type: 'jsonb',
                        isNullable: false,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        // Add index on createdAt for better query performance
        await queryRunner.createIndex(
            'study_plans',
            new TableIndex({
                name: 'IDX_STUDY_PLANS_CREATED_AT',
                columnNames: ['createdAt'],
            }),
        );

        // Add index on level for filtering
        await queryRunner.createIndex(
            'study_plans',
            new TableIndex({
                name: 'IDX_STUDY_PLANS_LEVEL',
                columnNames: ['level'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('study_plans', 'IDX_STUDY_PLANS_LEVEL');
        await queryRunner.dropIndex('study_plans', 'IDX_STUDY_PLANS_CREATED_AT');
        await queryRunner.dropTable('study_plans');
    }
}
