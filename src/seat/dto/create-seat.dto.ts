import { IsAlpha, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateSeatDto {
	@IsOptional()
	number?: string;

	@IsAlpha()
	@IsNotEmpty()
	zone: string;

	@IsNumber()
	@IsNotEmpty()
	row: number;

	@IsNumber()
	@IsNotEmpty()
	eventId: number;
}
