import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Event } from '@prisma/client';

@Injectable()
export class EventService {
	constructor(private prisma: PrismaService) {}

	async create(data: Prisma.EventCreateInput): Promise<Event> {
		return this.prisma.event.create({
			data,
		});
	}

	async findAll(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.EventWhereUniqueInput;
		where?: Prisma.EventWhereInput;
		orderBy?: Prisma.EventOrderByWithRelationInput;
	}): Promise<Event[]> {
		const { skip, take, cursor, where, orderBy } = params;
		return this.prisma.event.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		});
	}

	async findOne(
		eventWhereUniqueInput: Prisma.EventWhereUniqueInput,
	): Promise<Event | null> {
		return this.prisma.event.findUnique({
			where: eventWhereUniqueInput,
		});
	}

	async update(params: {
		where: Prisma.EventWhereUniqueInput;
		data: Prisma.EventUpdateInput;
	}): Promise<Event> {
		const { where, data } = params;
		return this.prisma.event.update({
			data,
			where,
		});
	}
	async remove(where: Prisma.EventWhereUniqueInput): Promise<Event> {
		return this.prisma.event.delete({
			where,
		});
	}
}
