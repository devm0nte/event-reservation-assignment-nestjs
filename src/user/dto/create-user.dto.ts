import {
	IsEmail,
	IsMobilePhone,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsNotEmpty()
	name: string;

	@IsOptional()
	@IsMobilePhone('th-TH')
	phone?: string;
}
