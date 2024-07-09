-- CreateTable
CREATE TABLE "trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destination" TEXT NOT NULL,
    "start_at" DATETIME NOT NULL,
    "ends_st" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
