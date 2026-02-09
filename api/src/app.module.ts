import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from './ai/ai.module';
import { StudyPlansModule } from './study-plans/study-plans.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudyPlan } from './study-plans/entities/study-plan.entity';
import { User } from './users/entities/user.entity';
import { AiRequest } from './ai/entities/ai-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'postgres'),
          database: configService.get('DB_NAME', 'learn_with_ai'),
          entities: [StudyPlan, User, AiRequest],
          migrations: ['dist/migrations/*.js'],
          migrationsTableName: 'migrations',
          migrationsRun: isProduction, // Auto-run migrations in production
          synchronize: !isProduction, // Only sync in development, use migrations in production
        };
      },
    }),
    AiModule,
    StudyPlansModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }
