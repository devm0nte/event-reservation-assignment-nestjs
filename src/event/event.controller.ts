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
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '@prisma/client';
@Controller('events')
export class EventController {
	constructor(private readonly eventService: EventService) {}

	@Post()
	async create(
		@Body()
		dto: CreateEventDto,
	): Promise<Event> {
		const { name, description, datetimeStart, location, totalSeat } = dto;
		return this.eventService.create({
			name: name,
			description,
			datetimeStart: new Date(datetimeStart),
			location,
			totalSeat,
		});
	}

	@Get()
	async findAll(): Promise<Event[]> {
		return this.eventService.findAll({});
	}

	@Get('filter/:searchString')
	async getFilteredEvent(
		@Param('searchString') searchString: string,
	): Promise<Event[]> {
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
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<Event> {
		return this.eventService.findOne({ id: Number(id) });
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body()
		dto: UpdateEventDto,
	): Promise<Event> {
		const { name, description, datetimeStart, location, totalSeat } = dto;
		return this.eventService.update({
			where: { id: Number(id) },
			data: {
				name,
				description,
				datetimeStart: datetimeStart ? new Date(datetimeStart) : null,
				location,
				totalSeat,
			},
		});
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<Event> {
		return this.eventService.remove({ id: Number(id) });
	}
}
