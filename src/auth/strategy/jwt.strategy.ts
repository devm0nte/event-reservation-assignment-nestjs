import { Injectable } from '@nestjs/common';
import { getConfigToken } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: getConfigToken('JWT_SECRET'),
		});
	}

	async validate(payload: { sub: number; email: string }) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: payload.sub,
			},
		});
		delete user.password;
		return user;
	}
}
