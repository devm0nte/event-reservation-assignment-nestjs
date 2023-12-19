import { Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { EventService } from '../event/event.service';

@Module({
	controllers: [SeatController],
	providers: [SeatService, EventService],
})
export class SeatModule {}
