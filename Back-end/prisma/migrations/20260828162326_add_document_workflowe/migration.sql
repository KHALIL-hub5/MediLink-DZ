/*
  Warnings:

  - Changed the type of `type` on the `clinic_verification_documents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `pharmacy_verification_documents` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "clinic_verification_documents" DROP COLUMN "type",
ADD COLUMN     "type" "ClinicVerificationDocumentType" NOT NULL;

-- AlterTable
ALTER TABLE "pharmacy_verification_documents" DROP COLUMN "type",
ADD COLUMN     "type" "PharmacyVerificationDocumentType" NOT NULL;
