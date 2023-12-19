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
	HttpException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from '@prisma/client';
import { JwtGuard } from '../auth/guard/auth.guard';
import { GetUser } from '../auth/decorator/getuser.decorator';
import { SeatService } from '../seat/seat.service';

@Controller('reserve')
export class ReservationController {
	constructor(
		private readonly reservationService: ReservationService,
		private readonly seatService: SeatService,
	) {}

	@UseGuards(JwtGuard)
	@Post('events/:id')
	async create(
		@Param('id') eventId: string,
		@GetUser('id') userId: number,
		@Body()
		dto: CreateReservationDto,
	): Promise<Reservation> {
		try {
			// check if status unavailable throw error

			const isAvailable = await this.seatService.findOne({
				id: dto.seatId,
				eventId: Number(eventId),
				status: true,
			});
			if (!isAvailable) {
				throw new Error('This Seat is not available for Reservation');
			}

			const result: Reservation = await this.reservationService.create({
				user: { connect: { id: userId } },
				event: { connect: { id: Number(eventId) } },
				seat: { connect: { id: dto.seatId } },
			});

			await this.seatService.update({
				where: { id: dto.seatId },
				data: { status: false },
			});

			return result;
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(JwtGuard)
	@Get()
	async findAll(@GetUser('id') userId: number) {
		try {
			return this.reservationService.findAll({
				where: { userId: userId },
			});
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(JwtGuard)
	@Get(':id')
	async findOne(@GetUser('id') userId: number, @Param('id') id: string) {
		try {
			return this.reservationService.findOne({
				id: Number(id),
				userId: userId,
			});
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	@UseGuards(JwtGuard)
	@Post(':id/cancel')
	async cancelReserve(
		@Param('id') reserveId: string,
		@GetUser('id') userId: number,
	) {
		try {
			const found = await this.reservationService.findOne({
				id: Number(reserveId),
				userId: userId,
			});
			await this.seatService.update({
				where: { id: found.seatId },
				data: { status: true },
			});

			return this.reservationService.update({
				where: { id: Number(reserveId) },
				data: {
					cancelledAt: new Date(),
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

	@UseGuards(JwtGuard)
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body()
		dto: UpdateReservationDto,
	): Promise<Reservation> {
		try {
			const { eventId, seatId } = dto;

			return this.reservationService.update({
				where: { id: Number(id) },
				data: {
					...(eventId ? { event: { connect: { id: eventId } } } : {}),
					...(seatId ? { seat: { connect: { id: seatId } } } : {}),
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
	remove(@Param('id') id: string) {
		try {
			return this.reservationService.remove({ id: Number(id) });
		} catch (error) {
			console.error('Error creating reservations:', error);
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
