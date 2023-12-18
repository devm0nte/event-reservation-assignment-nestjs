import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConfigToken } from '@nestjs/config';

import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}

	async register(userDto: CreateUserDto) {
		const hash = await argon.hash(userDto.password);
		userDto.password = hash;
		try {
			const user = await this.prisma.user.create({
				data: userDto,
			});

			return this.signToken(user.id, user.email);
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw error;
		}
	}

	async login(authDto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: authDto.email,
			},
		});
		if (!user) throw new ForbiddenException('Credentials incorrect');

		const verifyPassword = await argon.verify(
			user.password,
			authDto.password,
		);
		if (!verifyPassword)
			throw new ForbiddenException('Credentials incorrect');
		return this.signToken(user.id, user.email);
	}

	async signToken(
		userId: number,
		email: string,
	): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			email,
		};
		const secret = getConfigToken('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '60m',
			secret: secret,
		});

		return {
			access_token: token,
		};
	}
}
