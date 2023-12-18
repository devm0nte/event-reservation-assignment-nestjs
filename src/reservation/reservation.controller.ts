import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	HttpStatus,
	HttpCode,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from '@prisma/client';
import { JwtGuard } from '../auth/guard/auth.guard';
import { GetUser } from '../auth/decorator/getuser.decorator';

@Controller('reservations')
export class ReservationController {
	constructor(private readonly reservationService: ReservationService) {}

	@UseGuards(JwtGuard)
	@Post()
	async create(
		@GetUser('id') userId: number,
		@Body()
		dto: CreateReservationDto,
	): Promise<Reservation> {
		const { eventId, seatId } = dto;
		return this.reservationService.create({
			user: { connect: { id: userId } },
			event: { connect: { id: eventId } },
			seat: { connect: { id: seatId } },
		});
	}

	@Get()
	async findAll() {
		return this.reservationService.findAll({});
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return this.reservationService.findOne({ id: Number(id) });
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body()
		dto: UpdateReservationDto,
	): Promise<Reservation> {
		const { eventId, seatId } = dto;

		return this.reservationService.update({
			where: { id: Number(id) },
			data: {
				...(eventId ? { event: { connect: { id: eventId } } } : {}),
				...(seatId ? { seat: { connect: { id: seatId } } } : {}),
			},
		});
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.reservationService.remove({ id: Number(id) });
	}
}
