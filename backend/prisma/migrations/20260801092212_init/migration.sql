-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('waiting', 'called', 'skipped', 'done');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'cashier');

-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "queue_number" INTEGER NOT NULL,
    "queue_status" "QueueStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "called_at" TIMESTAMP(3),

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
