import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { StudyPlan } from '../study-plans/entities/study-plan.entity';

// Load environment variables
config();

const configService = new ConfigService();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD', 'postgres'),
  database: configService.get('DB_NAME', 'learn_with_ai'),
  entities: [StudyPlan],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  synchronize: false, // Always false when using migrations
};

// DataSource for TypeORM CLI
export default new DataSource(typeOrmConfig);
