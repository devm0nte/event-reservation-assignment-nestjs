import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReservationModule } from './reservation/reservation.module';
import { SeatModule } from './seat/seat.module';
import { EventModule } from './event/event.module';
import { EventModule } from './event/event.module';
import { SeatModule } from './seat/seat.module';
import { SeatModule } from './event/seat/seat.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		AuthModule,
		UserModule,
		EventModule,
		SeatModule,
		ReservationModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
