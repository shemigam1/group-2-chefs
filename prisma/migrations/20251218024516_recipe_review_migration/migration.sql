/*
  Warnings:

  - You are about to alter the column `comment` on the `RecipeReview` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - A unique constraint covering the columns `[userId,recipeId]` on the table `RecipeReview` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RecipeReview" ADD COLUMN     "flag_reason" VARCHAR,
ADD COLUMN     "helpful_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_flagged" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "comment" SET DATA TYPE VARCHAR(500);

-- CreateIndex
CREATE INDEX "RecipeReview_is_flagged_idx" ON "RecipeReview"("is_flagged");

-- CreateIndex
CREATE INDEX "RecipeReview_rating_idx" ON "RecipeReview"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeReview_userId_recipeId_key" ON "RecipeReview"("userId", "recipeId");
