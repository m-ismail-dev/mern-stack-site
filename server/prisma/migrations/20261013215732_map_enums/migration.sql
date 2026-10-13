/*
  Warnings:

  - The `status` column on the `bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `plan` column on the `subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('CUSTOMER', 'PROVIDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('PENDING', 'QOUTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELED');

-- CreateEnum
CREATE TYPE "subscription_plan" AS ENUM ('FREE', 'STARTER', 'PRO', 'BUSINESS');

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "status",
ADD COLUMN     "status" "booking_status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "plan",
ADD COLUMN     "plan" "subscription_plan" NOT NULL DEFAULT 'FREE',
DROP COLUMN "status",
ADD COLUMN     "status" "subscription_status" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "role" NOT NULL DEFAULT 'CUSTOMER';

-- DropEnum
DROP TYPE "BookingStatus";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "SubscriptionPlan";

-- DropEnum
DROP TYPE "SubscriptionStatus";
