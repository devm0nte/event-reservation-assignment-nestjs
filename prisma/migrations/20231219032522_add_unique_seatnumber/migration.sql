/*
  Warnings:

  - A unique constraint covering the columns `[number,eventId]` on the table `seats` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "seats_number_eventId_key" ON "seats"("number", "eventId");
