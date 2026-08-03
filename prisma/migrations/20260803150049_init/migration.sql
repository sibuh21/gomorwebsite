-- CreateEnum
CREATE TYPE "Status" AS ENUM ('COMPLETED', 'IN_PROGRES', 'NOT_STARTED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('LANDSCAPE', 'ARCHITECTURAL', 'STRUCTURAL', 'INTERIOR');

-- CreateEnum
CREATE TYPE "Typology" AS ENUM ('Culture', 'Education', 'Work', 'Hospitality', 'Residential', 'Infrastructure', 'Space', 'Sports', 'Health', 'Religion', 'Exhibition');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'USER');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "typology" "Typology" NOT NULL DEFAULT 'Culture',
    "category" "Category" NOT NULL DEFAULT 'ARCHITECTURAL',
    "status" "Status" NOT NULL DEFAULT 'COMPLETED',
    "imagePaths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videoPaths" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
