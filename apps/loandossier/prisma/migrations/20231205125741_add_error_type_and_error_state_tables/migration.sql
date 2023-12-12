-- AlterTable
ALTER TABLE "Error" ADD COLUMN     "errorStateId" INTEGER,
ADD COLUMN     "errorTypeId" INTEGER;

-- CreateTable
CREATE TABLE "ErrorType" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "ErrorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorState" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "createAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),

    CONSTRAINT "ErrorState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ErrorType_code_key" ON "ErrorType"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ErrorState_code_key" ON "ErrorState"("code");

-- AddForeignKey
ALTER TABLE "Error" ADD CONSTRAINT "Error_errorTypeId_fkey" FOREIGN KEY ("errorTypeId") REFERENCES "ErrorType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Error" ADD CONSTRAINT "Error_errorStateId_fkey" FOREIGN KEY ("errorStateId") REFERENCES "ErrorState"("id") ON DELETE SET NULL ON UPDATE CASCADE;
