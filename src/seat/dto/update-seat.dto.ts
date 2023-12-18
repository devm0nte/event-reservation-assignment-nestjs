import { PartialType } from '@nestjs/mapped-types';
import { CreateSeatDto } from './create-seat.dto';
import { IsAlpha, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSeatDto extends PartialType(CreateSeatDto) {
	@IsOptional()
	@IsNumber()
	newSeatId?: number;

	@IsOptional()
	@IsString()
	number?: string;

	@IsOptional()
	@IsAlpha()
	zone?: string;

	@IsOptional()
	@IsNumber()
	row?: number;

	@IsNumber()
	@IsOptional()
	eventId?: number;
}
