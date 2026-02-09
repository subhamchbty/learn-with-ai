import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(email: string, name: string, password: string): Promise<User> {
        const existingUser = await this.usersRepository.findOne({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.usersRepository.create({
            email,
            name,
            password: hashedPassword,
        });

        return this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id } });
    }

    async validatePassword(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    async incrementTokenUsage(userId: string, tokensUsed: number): Promise<void> {
        const user = await this.findById(userId);
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];
        const lastReset = user.lastTokenReset
            ? (user.lastTokenReset instanceof Date
                ? user.lastTokenReset.toISOString().split('T')[0]
                : new Date(user.lastTokenReset).toISOString().split('T')[0])
            : null;

        // Reset daily tokens if it's a new day
        if (lastReset !== today) {
            user.dailyTokensUsed = tokensUsed;
            user.lastTokenReset = new Date();
        } else {
            user.dailyTokensUsed += tokensUsed;
        }

        user.totalTokensUsed += tokensUsed;
        await this.usersRepository.save(user);
    }

    async getTokenUsage(userId: string): Promise<{ totalTokensUsed: number; dailyTokensUsed: number } | null> {
        const user = await this.findById(userId);
        if (!user) return null;

        const today = new Date().toISOString().split('T')[0];
        const lastReset = user.lastTokenReset
            ? (user.lastTokenReset instanceof Date
                ? user.lastTokenReset.toISOString().split('T')[0]
                : new Date(user.lastTokenReset).toISOString().split('T')[0])
            : null;

        // Reset daily tokens if it's a new day
        if (lastReset !== today) {
            user.dailyTokensUsed = 0;
            user.lastTokenReset = new Date();
            await this.usersRepository.save(user);
        }

        return {
            totalTokensUsed: user.totalTokensUsed,
            dailyTokensUsed: user.dailyTokensUsed,
        };
    }
}
