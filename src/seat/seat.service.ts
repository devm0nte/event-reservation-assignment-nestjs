import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Seat } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SeatService {
	constructor(private prisma: PrismaService) {}

	async create(data: Prisma.SeatCreateInput): Promise<Seat> {
		try {
			const result = await this.prisma.seat.create({
				data,
			});
			return result;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ConflictException(
						'This seat has already existed',
					);
				}
			}
			throw error;
		}
	}

	async findAll(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.SeatWhereUniqueInput;
		where?: Prisma.SeatWhereInput;
		orderBy?: Prisma.SeatOrderByWithRelationInput;
	}): Promise<Seat[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.seat.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async count(seatWhereInput: Prisma.SeatWhereInput): Promise<number> {
		return this.prisma.seat.count({
			where: seatWhereInput,
		});
	}

	async findOne(
		seatWhereUniqueInput: Prisma.SeatWhereUniqueInput,
	): Promise<Seat | null> {
		return this.prisma.seat.findUnique({
			where: seatWhereUniqueInput,
		});
	}

	async update(params: {
		where: Prisma.SeatWhereUniqueInput;
		data: Prisma.SeatUpdateInput;
	}): Promise<Seat> {
		const { where, data } = params;
		return this.prisma.seat.update({
			data,
			where,
		});
	}
	async remove(where: Prisma.SeatWhereUniqueInput): Promise<Seat> {
		try {
			const result = await this.prisma.seat.delete({
				where,
			});
			return result;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ConflictException(
						'This seat has already existed',
					);
				}
			}
		}
	}
}
