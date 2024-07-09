-- CreateTable
CREATE TABLE "paryicipants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "tripId" TEXT NOT NULL,
    CONSTRAINT "paryicipants_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);