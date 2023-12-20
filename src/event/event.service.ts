import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Event } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class EventService {
	constructor(
		private prisma: PrismaService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	includeField = {
		seats: {
			select: {
				id: true,
				number: true,
				zone: true,
				row: true,
				status: true,
			},
		},
	};
	async create(data: Prisma.EventCreateInput): Promise<Event> {
		const result = await this.prisma.event.create({
			data,
		});
		await this.setCacheEvent();
		return result;
	}

	async setCacheEvent(): Promise<void> {
		const result: Event[] = await this.prisma.event.findMany({});
		await this.cacheManager.set('cachedEvents', result);
	}

	async getCache(): Promise<Event[]> {
		return await this.cacheManager.get('cachedEvents');
	}

	async findAll(params: {
		skip?: number;
		take?: number;
		cursor?: Prisma.EventWhereUniqueInput;
		where?: Prisma.EventWhereInput;
		orderBy?: Prisma.EventOrderByWithRelationInput;
	}): Promise<Event[]> {
		// if (!eventCache || !eventCache.length) {
		const { skip, take, cursor, where, orderBy } = params;

		const result = await this.prisma.event.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
			include: this.includeField,
		});

		// check cache
		const cache = await this.getCache();
		if (!cache) {
			await this.setCacheEvent();
		}

		return result;
	}

	async findOne(
		eventWhereUniqueInput: Prisma.EventWhereUniqueInput,
	): Promise<Event | null> {
		return this.prisma.event.findUnique({
			where: eventWhereUniqueInput,
			include: this.includeField,
		});
	}

	async update(params: {
		where: Prisma.EventWhereUniqueInput;
		data: Prisma.EventUpdateInput;
	}): Promise<Event> {
		const { where, data } = params;
		const result = await this.prisma.event.update({
			data,
			where,
		});
		await this.setCacheEvent();
		return result;
	}
	async remove(where: Prisma.EventWhereUniqueInput): Promise<Event> {
		const result = await this.prisma.event.delete({
			where,
		});
		await this.setCacheEvent();
		return result;
	}
}
