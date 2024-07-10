/*
  Warnings:

  - You are about to drop the column `trip_Id` on the `activity` table. All the data in the column will be lost.
  - Added the required column `tripId` to the `activity` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "occur_at" DATETIME NOT NULL,
    "tripId" TEXT NOT NULL,
    CONSTRAINT "activity_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_activity" ("id", "occur_at", "title") SELECT "id", "occur_at", "title" FROM "activity";
DROP TABLE "activity";
ALTER TABLE "new_activity" RENAME TO "activity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
