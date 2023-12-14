-- CreateTable
CREATE TABLE "TeamGames" (
    "id" SERIAL NOT NULL,
    "teamId" TEXT,
    "gameId" TEXT,
    "is_home" BOOLEAN NOT NULL,

    CONSTRAINT "TeamGames_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "week" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeamGames_teamId_gameId_idx" ON "TeamGames"("teamId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "games_espn_id_key" ON "games"("espn_id");

-- AddForeignKey
ALTER TABLE "TeamGames" ADD CONSTRAINT "TeamGames_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamGames" ADD CONSTRAINT "TeamGames_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
