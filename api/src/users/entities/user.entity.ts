import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index()
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column({ name: 'total_tokens_used', type: 'integer', default: 0 })
    totalTokensUsed: number;

    @Column({ name: 'daily_tokens_used', type: 'integer', default: 0 })
    dailyTokensUsed: number;

    @Column({ name: 'last_token_reset', type: 'date', nullable: true })
    lastTokenReset: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
