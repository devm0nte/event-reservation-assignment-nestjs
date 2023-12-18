import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEventDto {
	@IsNotEmpty()
	name: string;
	@IsOptional()
	description?: string;

	@IsDateString()
	datetimeStart: string;
	@IsOptional()
	location?: any;
	@IsOptional()
	totalSeat?: number;
}
