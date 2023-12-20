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
	NotFoundException,
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

	async isEventExist(eventId: number): Promise<boolean> {
		try {
			const found = await this.eventService.findOne({ id: eventId });
			return !!found;
		} catch (error) {
			console.error('Error checking event exist:', error);
			return false;
		}
	}

	async isSeatExist(seatId: number): Promise<boolean> {
		try {
			const found = await this.seatService.findOne({ id: seatId });
			return !!found;
		} catch (error) {
			console.error('Error checking seat exist:', error);
			return false;
		}
	}

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

			// check event was exist
			const eventExist = await this.isEventExist(eventId);
			if (!eventExist) {
				throw new NotFoundException('Event does not exist');
			}

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
			const result = await this.seatService.findAll({});
			if (!result || !result.length) {
				throw new NotFoundException('Seat not found');
			}

			return result;
		} catch (error) {
			console.error('Error getting all seat:', error);
			throw error;
		}
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		try {
			const result = await this.seatService.findOne({ id: Number(id) });
			if (!result) {
				throw new NotFoundException('Seat not found');
			}
			return result;
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
			const { zone, row, eventId } = dto;
			const seatZone: string = zone.toUpperCase();
			const seatRow: string = row.toString();
			const seatNumber: string = `${seatZone}${seatRow}`;

			const seatExist = await this.isSeatExist(Number(id));
			if (!seatExist) {
				throw new NotFoundException('Seat not found');
			}

			// check target event
			const eventExist = await this.isEventExist(eventId);
			if (!eventExist) {
				throw new NotFoundException('Event does not exist');
			}

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
			const seatExist = await this.isSeatExist(Number(id));
			if (!seatExist) {
				throw new NotFoundException('Seat not found');
			}
			return this.seatService.remove({ id: Number(id) });
		} catch (error) {
			console.error('Error deleting a seat:', error);
			throw error;
		}
	}
}
