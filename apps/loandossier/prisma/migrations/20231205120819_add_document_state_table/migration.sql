/*
  Warnings:

  - You are about to drop the column `status` on the `DocumentVersion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DocumentVersion" DROP COLUMN "status",
ADD COLUMN     "documentStateId" INTEGER;

-- CreateTable
CREATE TABLE "DocumentState" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "createAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "DocumentState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentState_code_key" ON "DocumentState"("code");

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentStateId_fkey" FOREIGN KEY ("documentStateId") REFERENCES "DocumentState"("id") ON DELETE SET NULL ON UPDATE CASCADE;
