import {
    Controller,
    Post,
    Body,
    Get,
    UseGuards,
    Session,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto, @Session() session: any) {
        const user = await this.authService.signup(signupDto);
        session.userId = user.id;
        return user;
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto, @Session() session: any) {
        const user = await this.authService.login(loginDto);
        session.userId = user.id;
        return user;
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
    async logout(@Session() session: any) {
        return new Promise((resolve, reject) => {
            session.destroy((err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ message: 'Logged out successfully' });
                }
            });
        });
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async getCurrentUser(@CurrentUser() user: any) {
        return user;
    }
}
