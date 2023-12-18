import {
	IsEmail,
	IsMobilePhone,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';

export class AuthDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsOptional()
	name?: string;
	@IsOptional()
	@IsMobilePhone('th-TH')
	phone?: string;
}
