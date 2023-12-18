import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {
	@IsOptional()
	name?: string;
	@IsOptional()
	description?: string;
	@IsDateString()
	@IsOptional()
	datetimeStart?: string;
	@IsOptional()
	location?: object;
	@IsOptional()
	totalSeat?: number;
}
