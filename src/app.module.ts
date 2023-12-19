import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ReservationModule } from './reservation/reservation.module';
import { SeatModule } from './seat/seat.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from '../configs/app-options.constants';
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
	imports: [
		CacheModule.registerAsync(RedisOptions),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		EventModule,
		SeatModule,
		ReservationModule,
		PrismaModule,
	],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
})
export class AppModule {}
