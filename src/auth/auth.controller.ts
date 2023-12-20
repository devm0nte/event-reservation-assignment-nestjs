import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() userDto: CreateUserDto) {
		try {
			return this.authService.register(userDto);
		} catch (error) {
			console.error('Error on registering user:', error);
			throw error;
		}
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(@Body() authDto: AuthDto) {
		try {
			return this.authService.login(authDto);
		} catch (error) {
			console.error('Error user login:', error);
			throw error;
		}
	}
}
