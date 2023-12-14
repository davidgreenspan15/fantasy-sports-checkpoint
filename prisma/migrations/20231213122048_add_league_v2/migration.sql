-- CreateTable
CREATE TABLE "leagues" (
    "id" TEXT NOT NULL,
    "espn_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "abr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sport" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "leagues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leagues_espn_id_key" ON "leagues"("espn_id");

-- CreateIndex
CREATE UNIQUE INDEX "leagues_abr_key" ON "leagues"("abr");

-- CreateIndex
CREATE UNIQUE INDEX "leagues_slug_key" ON "leagues"("slug");
