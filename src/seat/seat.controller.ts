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
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { Seat } from '@prisma/client';
import { EventService } from '../event/event.service';

@Controller('seats')
export class SeatController {
	constructor(
		private readonly seatService: SeatService,
		private readonly eventService: EventService,
	) {}

	@Post()
	async create(
		@Body()
		dto: CreateSeatDto,
	): Promise<Seat> {
		try {
			const { zone, row, eventId } = dto;
			const seatZone: string = zone.toUpperCase();
			const seatRow: string = row.toString();
			const seatNumber: string = `${seatZone}${seatRow}`;

			const result = await this.seatService.create({
				number: seatNumber,
				zone: zone.toUpperCase(),
				row: row.toString(),
				event: { connect: { id: eventId } },
			});

			const cnt: number = await this.seatService.count({
				eventId: eventId,
			});

			await this.eventService.update({
				where: { id: eventId },
				data: { totalSeat: cnt },
			});

			return result;
		} catch (error) {
			console.error('Error creating seat:', error);
			throw error;
		}
	}

	@Get()
	async findAll(): Promise<Seat[]> {
		try {
			return this.seatService.findAll({});
		} catch (error) {
			console.error('Error getting all seat:', error);
			throw error;
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		try {
			return this.seatService.findOne({ id: Number(id) });
		} catch (error) {
			console.error('Error getting a seat by Id:', error);
			throw error;
		}
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body()
		dto: UpdateSeatDto,
	): Promise<Seat> {
		try {
			console.log(dto, id);
			const { zone, row, eventId } = dto;
			const seatZone: string = zone.toUpperCase();
			const seatRow: string = row.toString();
			const seatNumber: string = `${seatZone}${seatRow}`;

			const result = await this.seatService.update({
				where: { id: Number(id) },
				data: {
					number: seatNumber,
					zone: zone.toUpperCase(),
					row: row.toString(),
					...(eventId ? { event: { connect: { id: eventId } } } : {}),
				},
			});

			const cnt: number = await this.seatService.count({
				eventId: eventId,
			});
			console.log(cnt, eventId);
			await this.eventService.update({
				where: { id: eventId },
				data: { totalSeat: cnt },
			});
			return result;
		} catch (error) {
			console.error('Error updating a seat:', error);
			throw error;
		}
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		try {
			return this.seatService.remove({ id: Number(id) });
		} catch (error) {
			console.error('Error deleting a seat:', error);
			throw error;
		}
	}
}
