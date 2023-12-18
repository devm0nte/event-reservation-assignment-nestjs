import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() userDto: CreateUserDto) {
		return this.authService.register(userDto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('login')
	login(@Body() authDto: AuthDto) {
		return this.authService.login(authDto);
	}
}
