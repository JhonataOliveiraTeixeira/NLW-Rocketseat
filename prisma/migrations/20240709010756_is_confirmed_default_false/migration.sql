-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destination" TEXT NOT NULL,
    "start_at" DATETIME NOT NULL,
    "ends_st" DATETIME NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_trip" ("created_at", "destination", "ends_st", "id", "is_confirmed", "start_at") SELECT "created_at", "destination", "ends_st", "id", "is_confirmed", "start_at" FROM "trip";
DROP TABLE "trip";
ALTER TABLE "new_trip" RENAME TO "trip";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
