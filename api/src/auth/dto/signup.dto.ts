import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class SignupDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(8)
    password: string;
}
