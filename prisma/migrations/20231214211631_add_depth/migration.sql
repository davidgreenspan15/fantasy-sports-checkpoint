-- CreateTable
CREATE TABLE "athlete_depths" (
    "id" TEXT NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "depth_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "athlete_depths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position_depths" (
    "id" TEXT NOT NULL,
    "position_id" TEXT NOT NULL,
    "depth_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "position_depths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depths" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "league_id" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "depths_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "depths_espn_id_league_id_key" ON "depths"("espn_id", "league_id");

-- AddForeignKey
ALTER TABLE "athlete_depths" ADD CONSTRAINT "athlete_depths_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_depths" ADD CONSTRAINT "athlete_depths_depth_id_fkey" FOREIGN KEY ("depth_id") REFERENCES "depths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_depths" ADD CONSTRAINT "position_depths_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "position_depths" ADD CONSTRAINT "position_depths_depth_id_fkey" FOREIGN KEY ("depth_id") REFERENCES "depths"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depths" ADD CONSTRAINT "depths_league_id_fkey" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
