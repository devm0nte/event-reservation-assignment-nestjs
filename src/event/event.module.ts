import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { SeatService } from '../seat/seat.service';

@Module({
	controllers: [EventController],
	providers: [EventService, SeatService],
})
export class EventModule {}
