-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "bailId" INTEGER;

-- CreateTable
CREATE TABLE "Bail" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL,
    "vin" TEXT NOT NULL,
    "dossierId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "Bail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bail_vin_key" ON "Bail"("vin");

-- AddForeignKey
ALTER TABLE "Bail" ADD CONSTRAINT "Bail_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "Dossier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_bailId_fkey" FOREIGN KEY ("bailId") REFERENCES "Bail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
