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

@Controller('seats')
export class SeatController {
	constructor(private readonly seatService: SeatService) {}

	@Post()
	async create(
		@Body()
		dto: CreateSeatDto,
	): Promise<Seat> {
		const { zone, row, eventId } = dto;
		const seatZone: string = zone.toUpperCase();
		const seatRow: string = row.toString();
		const seatNumber: string = `${seatZone}${seatRow}`;
		return this.seatService.create({
			number: seatNumber,
			zone: zone.toUpperCase(),
			row: row.toString(),
			event: { connect: { id: eventId } },
		});
	}

	@Get()
	async findAll(): Promise<Seat[]> {
		return this.seatService.findAll({});
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.seatService.findOne({ id: Number(id) });
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body()
		dto: UpdateSeatDto,
	): Promise<Seat> {
		const { zone, row, eventId } = dto;
		const seatZone: string = zone.toUpperCase();
		const seatRow: string = row.toString();
		const seatNumber: string = `${seatZone}${seatRow}`;
		return this.seatService.update({
			where: { id: Number(id) },
			data: {
				number: seatNumber,
				zone: zone.toUpperCase(),
				row: row.toString(),
				...(eventId ? { event: { connect: { id: eventId } } } : {}),
			},
		});
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		return this.seatService.remove({ id: Number(id) });
	}
}
