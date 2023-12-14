-- CreateTable
CREATE TABLE "athletes" (
    "id" TEXT NOT NULL,
    "espn_id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "guid" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "weight" INTEGER,
    "display_height" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,
    "team_id" TEXT,
    "positionId" TEXT NOT NULL,
    "number" TEXT,
    "is_injured" BOOLEAN NOT NULL,
    "injury_status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "positions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "position_group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "position_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "position_groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "athletes_uid_key" ON "athletes"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_guid_key" ON "athletes"("guid");

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "positions" ADD CONSTRAINT "positions_position_group_id_fkey" FOREIGN KEY ("position_group_id") REFERENCES "position_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
