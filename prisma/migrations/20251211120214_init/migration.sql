/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Expert` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - Made the column `walletAddress` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Expert" DROP COLUMN "isVerified",
ADD COLUMN     "certificateUrl" TEXT,
ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'active';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "walletAddress" SET NOT NULL;
