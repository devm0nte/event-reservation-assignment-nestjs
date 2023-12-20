import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpCode,
	HttpStatus,
	UseInterceptors,
	NotFoundException,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, Seat } from '@prisma/client';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { SeatService } from '../seat/seat.service';

@Controller('events')
@UseInterceptors(CacheInterceptor)
export class EventController {
	constructor(
		private readonly eventService: EventService,
		private readonly seatService: SeatService,
	) {}

	@Post()
	async create(
		@Body()
		dto: CreateEventDto,
	): Promise<Event> {
		try {
			const { name, description, datetimeStart, location, totalSeat } =
				dto;
			return this.eventService.create({
				name: name,
				description,
				datetimeStart: new Date(datetimeStart),
				location,
				totalSeat,
			});
		} catch (error) {
			console.error('Error on event creating:', error);
			throw error;
		}
	}

	@Get()
	@CacheKey('cachedEvents')
	@CacheTTL(5)
	async findAll(): Promise<Event[]> {
		try {
			const result = await this.eventService.findAll({});
			if (!result) {
				throw new NotFoundException('Event not found');
			}

			return result;
		} catch (error) {
			console.error('Error getting all events:', error);
			throw error;
		}
	}

	@Get('filter/:searchString')
	async getFilteredEvent(
		@Param('searchString') searchString: string,
	): Promise<Event[]> {
		try {
			const result = await this.eventService.findAll({
				where: {
					OR: [
						{
							name: { contains: searchString },
						},
						{
							description: { contains: searchString },
						},
					],
				},
			});
			if (!result) {
				throw new NotFoundException('Event not found');
			}
			return result;
		} catch (error) {
			console.error('Error getting events by filter:', error);
			throw error;
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Event> {
		try {
			const result = await this.eventService.findOne({ id: Number(id) });
			if (!result) {
				throw new NotFoundException('Event not found');
			}
			return result;
		} catch (error) {
			console.error('Error getting event by Id:', error);
			throw error;
		}
	}

	@Get(':id/seats')
	async findSeats(@Param('id') id: string): Promise<Seat[]> {
		try {
			return this.seatService.findAll({ where: { eventId: Number(id) } });
		} catch (error) {
			console.error('Error getting all Seats of the event:', error);
			throw error;
		}
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body()
		dto: UpdateEventDto,
	): Promise<Event> {
		try {
			const { name, description, datetimeStart, location, totalSeat } =
				dto;
			return this.eventService.update({
				where: { id: Number(id) },
				data: {
					name,
					description,
					datetimeStart: datetimeStart
						? new Date(datetimeStart)
						: null,
					location,
					totalSeat,
				},
			});
		} catch (error) {
			console.error('Error updating event:', error);
			throw error;
		}
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<Event> {
		try {
			return this.eventService.remove({ id: Number(id) });
		} catch (error) {
			console.error('Error deleting event:', error);
			throw error;
		}
	}
}
