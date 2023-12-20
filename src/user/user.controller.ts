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
	NotFoundException,
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

	async isUserExist(userId: number): Promise<boolean> {
		try {
			const found = await this.userService.findOne({ id: userId });
			return !!found;
		} catch (error) {
			console.error('Error checking user exist:', error);
			return false;
		}
	}

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
			console.error('Error creating user:', error);
			throw error;
		}
	}

	@Get()
	async findAll(@Query() params: any) {
		try {
			const result = await this.userService.findAll(params);
			if (!result || !result.length) {
				throw new NotFoundException('User not found');
			}
			return result;
		} catch (error) {
			console.error('Error getting all users:', error);
			throw error;
		}
	}

	@UseGuards(JwtGuard)
	@Get('whoami')
	async getUserDetail(@GetUser() user: User) {
		try {
			return user;
		} catch (error) {
			console.error('Error getting current user detail:', error);
			throw error;
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		try {
			const result = await this.userService.findOne({ id: Number(id) });
			if (!result) {
				throw new NotFoundException('User not found');
			}
			return result;
		} catch (error) {
			console.error('Error getting user by Id:', error);
			throw error;
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
			const isUserExist = await this.isUserExist(Number(id));
			if (!isUserExist) {
				throw new NotFoundException('User not found');
			}

			const { name, phone } = dto;
			return this.userService.update({
				where: { id: Number(id) },
				data: {
					name,
					phone,
				},
			});
		} catch (error) {
			console.error('Error updating user:', error);
			throw error;
		}
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		try {
			const isUserExist = await this.isUserExist(Number(id));
			if (!isUserExist) {
				throw new NotFoundException('User not found');
			}
			return this.userService.remove({ id: Number(id) });
		} catch (error) {
			console.error('Error deleting user:', error);
			throw error;
		}
	}
}
