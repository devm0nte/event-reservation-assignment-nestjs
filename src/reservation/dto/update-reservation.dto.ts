import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
	@IsOptional()
	@IsNumber()
	eventId: number;
	@IsOptional()
	@IsNumber()
	seatId: number;
	@IsOptional()
	@IsNumber()
	userId: number;
}
