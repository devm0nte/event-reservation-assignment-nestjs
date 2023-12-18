import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateReservationDto {
	@IsNotEmpty()
	@IsNumber()
	eventId: number;
	@IsNotEmpty()
	@IsNumber()
	seatId: number;
	@IsOptional()
	@IsNumber()
	userId: number;
}
