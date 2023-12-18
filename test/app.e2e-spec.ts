import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { CreateEventDto } from '../src/event/dto/create-event.dto';
import { UpdateEventDto } from '../src/event/dto/update-event.dto';
import { CreateSeatDto } from '../src/seat/dto/create-seat.dto';
import { UpdateSeatDto } from '../src/seat/dto/update-seat.dto';
import { stash } from 'pactum';

describe('api-test e2e', () => {
	let app: INestApplication;
	let prisma: PrismaService;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
			}),
		);
		await app.init();
		await app.listen(3001);

		prisma = app.get(PrismaService);
		await prisma.cleanDb();
		await prisma.initData();
		pactum.request.setBaseUrl('http://localhost:3001');
	});

	afterAll(() => {
		app.close();
	});

	describe('Auth', () => {
		const authDto: AuthDto = {
			email: 'test@mail.com',
			password: 'testtest',
			name: 'testUser',
			phone: '0987654321',
		};
		describe('Auth Register by User', () => {
			it('body do not have email, should throw error', () => {
				return pactum
					.spec()
					.post('/auth/register')
					.withBody({
						password: authDto.password,
					})
					.expectStatus(400);
			});
			it('body do not have password, should throw error', () => {
				return pactum
					.spec()
					.post('/auth/register')
					.withBody({
						email: authDto.email,
					})
					.expectStatus(400);
			});
			it('body is null, should throw error', () => {
				return pactum.spec().post('/auth/register').expectStatus(400);
			});
			it('body have all required data, should be pass and success', () => {
				return pactum
					.spec()
					.post('/auth/register')
					.withBody(authDto)
					.expectStatus(201);
			});
			it('body have dupplicate unique value, should throw error', () => {
				return pactum
					.spec()
					.post('/auth/register')
					.withBody(authDto)
					.expectStatus(403);
			});
		});

		describe('Auth Login by User', () => {
			it('body do not have email, should throw error', () => {
				return pactum
					.spec()
					.post('/auth/login')
					.withBody({
						password: authDto.password,
					})
					.expectStatus(400);
			});
			it('body do not have password, should throw error', () => {
				return pactum
					.spec()
					.post('/auth/login')
					.withBody({
						email: authDto.email,
					})
					.expectStatus(400);
			});
			it('body is null, should throw error', () => {
				return pactum.spec().post('/auth/login').expectStatus(400);
			});
			it('body have all required data, should be pass and success', () => {
				return pactum
					.spec()
					.post('/auth/login')
					.withBody(authDto)
					.expectStatus(200)
					.stores('userAt', 'access_token');
			});
		});
	});

	describe('User', () => {
		describe('get User detail', () => {
			it('send valid token, should be return user detail', () => {
				return pactum
					.spec()
					.get('/users/whoami')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectStatus(200);
			});
			it('send invalid token, should throw error', () => {
				return pactum
					.spec()
					.get('/users/whoami')
					.withHeaders({
						Authorization: 'Bearer ThisIsInvalidToken',
					})
					.expectStatus(401);
			});
		});

		describe('Edit user', () => {
			it('send all required data with valid token, should edit user', () => {
				const userDto: UpdateUserDto = {
					name: 'testUser2',
					phone: '0123456789',
				};
				return pactum
					.spec()
					.patch('/users')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.withBody(userDto)
					.expectStatus(200)
					.expectBodyContains(userDto.name)
					.expectBodyContains(userDto.phone);
			});
			it('do not send required data, should throw error', () => {
				const userDto: UpdateUserDto = {
					name: 'testUser2_again',
					phone: '0555555555',
				};
				return pactum
					.spec()
					.patch('/users')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.withBody({ phone: userDto.phone })
					.expectStatus(200)
					.expectBodyContains(userDto.phone);
			});
		});
	});

	describe('Event', () => {
		describe('create Event by Admin', () => {
			const eventDto: CreateEventDto = {
				name: 'New Year Concert',
				description:
					'The aniversary concert event at the end of the year.',
				datetimeStart: '2023-12-31 18:00:00',
				totalSeat: 300,
			};
			it('if valid input, should create Event', () => {
				return pactum
					.spec()
					.post('/events')
					.withBody(eventDto)
					.expectStatus(201)
					.stores('eventId', 'id');
			});
		});

		describe('Get all Events', () => {
			it('if db have the event, should get all event', () => {
				return pactum
					.spec()
					.get('/events')
					.expectStatus(200)
					.expectJsonLength(1);
			});
		});

		describe('Get Event by id', () => {
			it('if db have this Event id, should get the Event', () => {
				return pactum
					.spec()
					.get('/events/{id}')
					.withPathParams('id', '$S{eventId}')
					.expectStatus(200)
					.expectBodyContains('$S{eventId}');
			});
		});

		describe('Edit Event by id', () => {
			const eventDto: UpdateEventDto = {
				name: 'New Year Concert-edit',
				totalSeat: 250,
			};
			it('should edit event success', () => {
				return pactum
					.spec()
					.patch('/events/{id}')
					.withPathParams('id', '$S{eventId}')
					.withBody(eventDto)
					.expectStatus(200)
					.expectBodyContains(eventDto.name)
					.expectBodyContains(eventDto.totalSeat);
			});
		});

		describe('Delete Event by id', () => {
			it('if db have an Event id, should delete Event', () => {
				return pactum
					.spec()
					.delete('/events/{id}')
					.withPathParams('id', '$S{eventId}')
					.withHeaders({
						Authorization: 'Bearer $S{userAt}',
					})
					.expectStatus(204);
			});

			it('after delete the last event, should get empty array of event', () => {
				return pactum
					.spec()
					.get('/events')
					.expectStatus(200)
					.expectJsonLength(0);
			});
		});
	});

	describe('Seat', () => {
		// describe('create an Event for the seat', () => {
		// 	const eventDto: CreateEventDto = {
		// 		name: 'New Year Concert',
		// 		description:
		// 			'The aniversary concert event at the end of the year.',
		// 		datetimeStart: '2023-12-31 18:00:00',
		// 		totalSeat: 300,
		// 	};
		// 	it('if valid input, should create Event', () => {
		// 		return pactum
		// 			.spec()
		// 			.post('/events')
		// 			.withBody(eventDto)
		// 			.expectStatus(201)
		// 			.stores('eventId', 'id');
		// 	});
		// });
		describe('create Seat by Admin', () => {
			const eventDto: CreateEventDto = {
				name: 'New Year Concert',
				description:
					'The aniversary concert event at the end of the year.',
				datetimeStart: '2023-12-31 18:00:00',
				totalSeat: 300,
			};
			it('if valid input, should create Event', async () => {
				const res = await pactum
					.spec()
					.post('/events')
					.withBody(eventDto)
					.expectStatus(201)
					.stores('eventId2', 'id');
				stash.addDataMap({
					eventId2: res.json.id,
				});
				return res;
			});
			const seatDto: CreateSeatDto = {
				row: 2,
				zone: 'A',
				eventId: 1,
			};
			it('if valid input, should create Seat for this Event', () => {
				return pactum
					.spec()
					.post('/seats')
					.withJson({
						row: seatDto.row,
						zone: seatDto.zone,
						eventId: '$M{eventId2}',
					})
					.expectStatus(201)
					.stores('seatId', 'id');
			});
		});

		describe('Get all Seat', () => {
			it('if db have the Seat, should get all event', () => {
				return pactum
					.spec()
					.get('/seats')
					.expectStatus(200)
					.expectJsonLength(1);
			});
		});

		describe('Get Seat by id', () => {
			it('if db have this Seat id, should get the Seat', () => {
				return pactum
					.spec()
					.get('/seats/{id}')
					.withPathParams('id', '$S{seatId}')
					.expectStatus(200)
					.expectBodyContains('$S{seatId}');
			});
		});

		describe('Edit Seat by id', () => {
			const seatDto: UpdateSeatDto = {
				row: 10,
				zone: 'Z',
			};
			const invalidSeatDto: UpdateSeatDto = {
				row: 9,
				zone: '10',
			};
			it('if input valid data, should edit seat success', () => {
				return pactum
					.spec()
					.patch('/seats/{id}')
					.withPathParams('id', '$S{seatId}')
					.withBody(seatDto)
					.expectStatus(200)
					.expectBodyContains(seatDto.row)
					.expectBodyContains(seatDto.zone);
			});
			it('if input invalid data, should throw error', () => {
				return pactum
					.spec()
					.patch('/seats/{id}')
					.withPathParams('id', '$S{seatId}')
					.withBody(invalidSeatDto)
					.expectStatus(400);
			});
		});

		describe('Delete Seat by id', () => {
			it('if db have an Seat id, should delete Seat', () => {
				return pactum
					.spec()
					.delete('/seats/{id}')
					.withPathParams('id', '$S{seatId}')
					.expectStatus(204);
			});

			it('after delete the last seat, should get empty array of seat', () => {
				return pactum
					.spec()
					.get('/seats')
					.expectStatus(200)
					.expectJsonLength(0);
			});
		});
	});
});
