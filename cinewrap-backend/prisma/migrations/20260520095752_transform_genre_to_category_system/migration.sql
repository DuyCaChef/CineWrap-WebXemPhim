/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GenreToMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('GENRE', 'THEME', 'MOOD', 'COLLECTION', 'HIGHLIGHT');

-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED', 'DELETED');

-- DropForeignKey
ALTER TABLE "_GenreToMovie" DROP CONSTRAINT "_GenreToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_GenreToMovie" DROP CONSTRAINT "_GenreToMovie_B_fkey";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "_GenreToMovie";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "type" "CategoryType" NOT NULL DEFAULT 'GENRE',
    "slug" TEXT NOT NULL,
    "status" "CategoryStatus" NOT NULL DEFAULT 'DRAFT',
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "banner" TEXT,
    "color" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "showInMenu" BOOLEAN NOT NULL DEFAULT false,
    "showInHome" BOOLEAN NOT NULL DEFAULT false,
    "name" JSONB NOT NULL,
    "description" JSONB,
    "displayName" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieCategory" (
    "movieId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "MovieCategory_pkey" PRIMARY KEY ("movieId","categoryId")
);

-- CreateTable
CREATE TABLE "EpisodeCategory" (
    "episodeId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "EpisodeCategory_pkey" PRIMARY KEY ("episodeId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCategory" ADD CONSTRAINT "MovieCategory_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieCategory" ADD CONSTRAINT "MovieCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeCategory" ADD CONSTRAINT "EpisodeCategory_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodeCategory" ADD CONSTRAINT "EpisodeCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
