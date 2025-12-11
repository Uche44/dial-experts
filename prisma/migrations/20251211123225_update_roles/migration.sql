-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'expert');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
