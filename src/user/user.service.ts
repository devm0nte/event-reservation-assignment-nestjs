import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async create(data: Prisma.UserCreateInput): Promise<CreateUserDto> {
		return this.prisma.user.create({
			data,
		});
	}

	async findAll(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.UserWhereUniqueInput;
		where?: Prisma.UserWhereInput;
		orderBy?: Prisma.UserOrderByWithRelationInput;
	}): Promise<CreateUserDto[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.user.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async findOne(uuid: string) {
		const users = await this.prisma.user.findUnique({
			where: { uuid: uuid },
		});
		return users;
	}

	async update(id: number, userDto: UpdateUserDto) {
		const user = await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				...userDto,
			},
		});

		delete user.password;
		return user;
	}

	async remove(id: number) {
		const user = await this.prisma.user.delete({
			where: {
				id: id,
			},
		});

		return user;
	}
}
