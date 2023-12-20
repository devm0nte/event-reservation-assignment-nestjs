import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { SeatService } from '../seat/seat.service';
import { EventService } from '../event/event.service';

@Module({
	controllers: [ReservationController],
	providers: [ReservationService, SeatService, EventService],
})
export class ReservationModule {}
