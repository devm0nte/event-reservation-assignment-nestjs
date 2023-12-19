import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Reservation } from '@prisma/client';

@Injectable()
export class ReservationService {
	constructor(private prisma: PrismaService) {}

	includeField = {
		user: {
			select: {
				id: true,
				name: true,
				phone: true,
				email: true,
			},
		},
		event: {
			select: {
				id: true,
				name: true,
				description: true,
				datetimeStart: true,
				location: true,
				totalSeat: true,
			},
		},
		seat: {
			select: {
				id: true,
				number: true,
				zone: true,
				row: true,
				status: true,
			},
		},
	};

	async create(data: Prisma.ReservationCreateInput): Promise<Reservation> {
		return this.prisma.reservation.create({
			data,
			include: this.includeField,
		});
	}

	async findAll(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.ReservationWhereUniqueInput;
		where?: Prisma.ReservationWhereInput;
		orderBy?: Prisma.ReservationOrderByWithRelationInput;
	}): Promise<Reservation[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.reservation.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
			include: this.includeField,
		});
	}

	async findOne(
		eventWhereUniqueInput: Prisma.ReservationWhereUniqueInput,
	): Promise<Reservation | null> {
		return this.prisma.reservation.findUnique({
			where: eventWhereUniqueInput,
			include: this.includeField,
		});
	}

	async update(params: {
		where: Prisma.ReservationWhereUniqueInput;
		data: Prisma.ReservationUpdateInput;
	}): Promise<Reservation> {
		const { where, data } = params;
		return this.prisma.reservation.update({
			data,
			where,
		});
	}
	async remove(
		where: Prisma.ReservationWhereUniqueInput,
	): Promise<Reservation> {
		return this.prisma.reservation.delete({
			where,
		});
	}
}
