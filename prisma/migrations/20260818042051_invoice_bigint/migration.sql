/*
  Warnings:

  - You are about to drop the `InvoiceCounter` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "subtotalKobo" SET DATA TYPE BIGINT,
ALTER COLUMN "discountKobo" SET DATA TYPE BIGINT,
ALTER COLUMN "deliveryKobo" SET DATA TYPE BIGINT,
ALTER COLUMN "installationKobo" SET DATA TYPE BIGINT,
ALTER COLUMN "totalKobo" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "InvoiceItem" ALTER COLUMN "unitPriceKobo" SET DATA TYPE BIGINT,
ALTER COLUMN "amountKobo" SET DATA TYPE BIGINT;

-- DropTable
DROP TABLE "InvoiceCounter";
