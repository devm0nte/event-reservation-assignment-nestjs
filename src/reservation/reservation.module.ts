import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { SeatService } from '../seat/seat.service';

@Module({
	controllers: [ReservationController],
	providers: [ReservationService, SeatService],
})
export class ReservationModule {}
