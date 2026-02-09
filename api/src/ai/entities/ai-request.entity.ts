import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum RequestType {
    GENERATE_TOPICS = 'generate_topics',
    GENERATE_PLAN = 'generate_plan',
}

@Entity('ai_requests')
export class AiRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: RequestType,
    })
    @Index()
    requestType: RequestType;

    @Column({ type: 'text' })
    prompt: string;

    @Column()
    level: string;

    @Column({ type: 'integer', name: 'tokens_used' })
    tokensUsed: number;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any; // Store additional data like selectedTopics, response time, etc.

    @Column({ name: 'user_id', nullable: true })
    @Index()
    userId: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    @Index()
    createdAt: Date;
}
