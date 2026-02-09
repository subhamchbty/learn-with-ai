import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { StudyPlan } from './src/study-plans/entities/study-plan.entity';

// Load environment variables
config();

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'learn_with_ai',
    entities: [StudyPlan],
    migrations: ['src/migrations/*.ts'],
    migrationsTableName: 'migrations',
    synchronize: false,
});
