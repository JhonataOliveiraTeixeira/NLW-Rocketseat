-- CreateTable
CREATE TABLE "activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "occur_at" DATETIME NOT NULL,
    "tripId" TEXT NOT NULL,
    CONSTRAINT "activity_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "utl" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    CONSTRAINT "links_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
