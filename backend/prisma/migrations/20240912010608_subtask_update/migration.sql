/*
  Warnings:

  - You are about to drop the column `status` on the `SubTask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubTask" DROP COLUMN "status",
ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false;
