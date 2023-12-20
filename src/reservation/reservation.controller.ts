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
	NotFoundException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from '@prisma/client';
import { JwtGuard } from '../auth/guard/auth.guard';
import { GetUser } from '../auth/decorator/getuser.decorator';
import { SeatService } from '../seat/seat.service';
import { EventService } from '../event/event.service';

@Controller('reserve')
export class ReservationController {
	constructor(
		private readonly reservationService: ReservationService,
		private readonly seatService: SeatService,
		private readonly eventService: EventService,
	) {}

	async isReserveExist(reserveId: number): Promise<boolean> {
		try {
			const found = await this.reservationService.findOne({
				id: reserveId,
			});
			return !!found;
		} catch (error) {
			console.error('Error checking reservation exist:', error);
			return false;
		}
	}

	async isEventExist(eventId: number): Promise<boolean> {
		try {
			const found = await this.eventService.findOne({
				id: eventId,
			});
			return !!found;
		} catch (error) {
			console.error('Error checking event exist:', error);
			return false;
		}
	}

	@UseGuards(JwtGuard)
	@Post('events/:id')
	async create(
		@Param('id') eventId: string,
		@GetUser('id') userId: number,
		@Body()
		dto: CreateReservationDto,
	): Promise<Reservation> {
		try {
			const isAvailable = await this.seatService.findOne({
				id: dto.seatId,
				eventId: Number(eventId),
				status: true,
			});
			if (!isAvailable) {
				throw new HttpException(
					'Can not create reservation, This Seat is not available.',
					HttpStatus.BAD_REQUEST,
				);
			}

			const isEventExist = await this.isEventExist(Number(eventId));
			if (!isEventExist) {
				throw new NotFoundException('Event does not exist');
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
			throw error;
		}
	}

	@UseGuards(JwtGuard)
	@Get()
	async findAll(@GetUser('id') userId: number) {
		try {
			const result = await this.reservationService.findAll({
				where: { userId: userId },
			});
			if (!result || !result.length) {
				throw new NotFoundException('Reservation not found');
			}
			return result;
		} catch (error) {
			console.error('Error getting all reservation:', error);
			throw error;
		}
	}

	@UseGuards(JwtGuard)
	@Get(':id')
	async findOne(@GetUser('id') userId: number, @Param('id') id: string) {
		try {
			const result = await this.reservationService.findOne({
				id: Number(id),
				userId: userId,
			});
			if (!result) {
				throw new NotFoundException('Reservation not found');
			}
			return result;
		} catch (error) {
			console.error('Error getting a reservation:', error);
			throw error;
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
			if (!found) {
				throw new NotFoundException('Reservation not found');
			}
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
			console.error('Error on cancel reservation:', error);
			throw error;
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
			const isReserveExist = await this.isReserveExist(Number(id));
			if (!isReserveExist) {
				throw new NotFoundException('Reservation not found');
			}

			const isAvailable = await this.seatService.findOne({
				id: seatId,
				eventId: eventId,
				status: true,
			});
			if (!isAvailable) {
				throw new HttpException(
					'Can not create reservation, This Seat is not available.',
					HttpStatus.BAD_REQUEST,
				);
			}

			const isEventExist = await this.isEventExist(eventId);
			if (!isEventExist) {
				throw new NotFoundException('Event does not exist');
			}

			return this.reservationService.update({
				where: { id: Number(id) },
				data: {
					...(eventId ? { event: { connect: { id: eventId } } } : {}),
					...(seatId ? { seat: { connect: { id: seatId } } } : {}),
				},
			});
		} catch (error) {
			console.error('Error updating reservation:', error);
			throw error;
		}
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async remove(@Param('id') id: string) {
		try {
			const isReserveExist = await this.isReserveExist(Number(id));
			if (!isReserveExist) {
				throw new NotFoundException('Reservation not found');
			}
			return this.reservationService.remove({ id: Number(id) });
		} catch (error) {
			console.error('Error deleting reservation:', error);
			throw error;
		}
	}
}
