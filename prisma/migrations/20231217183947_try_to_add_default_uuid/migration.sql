/*
  Warnings:

  - Changed the type of `uuid` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `uuid` on the `Organizer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `uuid` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `uuid` on the `Seat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `uuid` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Organizer" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Event_uuid_key" ON "Event"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Organizer_uuid_key" ON "Organizer"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_uuid_key" ON "Reservation"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_uuid_key" ON "Seat"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");
