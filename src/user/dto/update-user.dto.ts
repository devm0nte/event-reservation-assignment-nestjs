import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	password?: string;

	@IsOptional()
	@IsOptional()
	name?: string;

	@IsOptional()
	@IsMobilePhone('th-TH')
	phone?: string;
}
