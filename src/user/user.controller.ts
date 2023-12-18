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
	async create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto);
	}

	@Get()
	async findAll(@Query() params: any) {
		return this.userService.findAll(params);
	}

	@UseGuards(JwtGuard)
	@Get('whoami')
	async getUserDetail(@GetUser() user: User) {
		return user;
	}

	@Get(':uuid')
	async findOne(@Param('uuid') uuid: string) {
		return this.userService.findOne(uuid);
	}

	@UseGuards(JwtGuard)
	@Patch()
	async update(
		@GetUser('id') userId: number,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.userService.update(userId, updateUserDto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: number) {
		return this.userService.remove(id);
	}
}
