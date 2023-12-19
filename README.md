<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Documentation Section

# Simple API Endpoints

## Auth

- **Register User:** `POST /auth/register`
  - Register a new user.

- **Login User:** `POST /auth/login`
  - Log in a user.

## User

- **Get User Details:** `GET /users/whoami`
  - Retrieve user details.

- **Edit User:** `PATCH /users`
  - Edit user information.

## Event

- **Create Event:** `POST /events`
  - Create a new event.

- **Get All Events:** `GET /events`
  - Retrieve a list of all events.

- **Get Event by ID:** `GET /events/{id}`
  - Retrieve details of a specific event.

- **Edit Event by ID:** `PATCH /events/{id}`
  - Edit details of a specific event.

- **Delete Event by ID:** `DELETE /events/{id}`
  - Delete a specific event.

## Seat

- **Create Seat:** `POST /seats`
  - Create a new seat.

- **Get All Seats:** `GET /seats`
  - Retrieve a list of all seats.

- **Get Seat by ID:** `GET /seats/{id}`
  - Retrieve details of a specific seat.

- **Edit Seat by ID:** `PATCH /seats/{id}`
  - Edit details of a specific seat.

- **Delete Seat by ID:** `DELETE /seats/{id}`
  - Delete a specific seat.

## Reservation

- **Create Reservation:** `POST /reserve/events/{id}`
  - Create a reservation for a specific event.

- **Get Reservations by Event ID:** `GET /reserve/{id}`
  - Retrieve reservations for a specific event.

- **Cancel Reservation:** `POST /reserve/{id}/cancel`
  - Cancel a specific reservation.