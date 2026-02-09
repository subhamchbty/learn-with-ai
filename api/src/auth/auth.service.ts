import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signup(signupDto: SignupDto) {
        const user = await this.usersService.create(
            signupDto.email,
            signupDto.name,
            signupDto.password,
        );

        // Don't return password
        const { password, ...result } = user;
        return result;
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.usersService.validatePassword(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Don't return password
        const { password, ...result } = user;
        return result;
    }

    async validateUser(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            return null;
        }
        const { password, ...result } = user;
        return result;
    }
}
