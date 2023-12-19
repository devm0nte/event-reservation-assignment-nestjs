import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	UseGuards,
	HttpStatus,
	HttpCode,
	HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guard/auth.guard';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/getuser.decorator';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(
		@Body()
		dto: CreateUserDto,
	): Promise<User> {
		try {
			const { name, email, password, phone } = dto;
			return this.userService.create({
				name,
				email,
				password,
				phone,
			});
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get()
	async findAll(@Query() params: any) {
		try {
			return this.userService.findAll(params);
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(JwtGuard)
	@Get('whoami')
	async getUserDetail(@GetUser() user: User) {
		try {
			return user;
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		try {
			return this.userService.findOne({ id: Number(id) });
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(JwtGuard)
	@Patch()
	async update(
		@GetUser('id') id: string,
		@Body()
		dto: UpdateUserDto,
	): Promise<User> {
		try {
			const { name, phone } = dto;
			return this.userService.update({
				where: { id: Number(id) },
				data: {
					name,
					phone,
				},
			});
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		try {
			return this.userService.remove({ id: Number(id) });
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
