import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Seat } from '@prisma/client';

@Injectable()
export class SeatService {
	constructor(private prisma: PrismaService) {}

	async create(data: Prisma.SeatCreateInput): Promise<Seat> {
		return this.prisma.seat.create({
			data,
		});
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
		return this.prisma.seat.delete({
			where,
		});
	}
}
