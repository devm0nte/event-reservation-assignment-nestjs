import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	HttpStatus,
	HttpCode,
	HttpException,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '@prisma/client';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('events')
export class EventController {
	constructor(private readonly eventService: EventService) {}

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
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get()
	@CacheKey('cachedEvents')
	@CacheTTL(60)
	async findAll(): Promise<Event[]> {
		try {
			return this.eventService.findAll({});
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get('filter/:searchString')
	async getFilteredEvent(
		@Param('searchString') searchString: string,
	): Promise<Event[]> {
		try {
			return this.eventService.findAll({
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
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Event> {
		try {
			return this.eventService.findOne({ id: Number(id) });
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
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
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<Event> {
		try {
			return this.eventService.remove({ id: Number(id) });
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
