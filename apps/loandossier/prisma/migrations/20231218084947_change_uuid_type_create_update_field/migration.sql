/*
  Warnings:

  - You are about to alter the column `code` on the `Document` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `Document` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `code` on the `DocumentState` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `name` on the `DocumentState` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `Dossier` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `code` on the `Error` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `code` on the `ErrorState` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `code` on the `ErrorType` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `createdAt` on the `VerificationStatus` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `VerificationStatus` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `VerificationType` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `VerificationType` table. All the data in the column will be lost.
  - Changed the type of `uuid` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `uuid` on the `Dossier` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `uuid` on the `Page` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL,
ALTER COLUMN "code" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "DocumentState" ALTER COLUMN "code" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Dossier" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Error" ALTER COLUMN "code" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "ErrorState" ALTER COLUMN "code" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "ErrorType" ALTER COLUMN "code" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "uuid",
ADD COLUMN     "uuid" UUID NOT NULL;

-- AlterTable
ALTER TABLE "VerificationStatus" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "VerificationType" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Document_uuid_key" ON "Document"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Dossier_uuid_key" ON "Dossier"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Page_uuid_key" ON "Page"("uuid");
