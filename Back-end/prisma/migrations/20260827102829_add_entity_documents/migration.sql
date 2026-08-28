-- CreateEnum
CREATE TYPE "PharmacyVerificationDocumentType" AS ENUM ('OPERATING_LICENSE', 'PHARMACIST_LICENSE', 'COMMERCIAL_REGISTRATION', 'OWNER_IDENTITY', 'OTHER');

-- CreateEnum
CREATE TYPE "PatientDocumentType" AS ENUM ('LAB_RESULT', 'IMAGING', 'MEDICAL_REPORT', 'PRESCRIPTION', 'OTHER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UploadCategory" ADD VALUE 'DOCTOR_DOCUMENT';
ALTER TYPE "UploadCategory" ADD VALUE 'CLINIC_LICENSE';
ALTER TYPE "UploadCategory" ADD VALUE 'CLINIC_DOCUMENT';

-- CreateTable
CREATE TABLE "clinic_verification_documents" (
    "id" UUID NOT NULL,
    "clinic_id" UUID NOT NULL,
    "type" "VerificationDocumentType" NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "status" "VerificationDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "review_note" TEXT,
    "reviewed_by_id" UUID,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),

    CONSTRAINT "clinic_verification_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_documents" (
    "id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" "PatientDocumentType" NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "title" VARCHAR(255),
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clinic_verification_documents_clinic_id_status_idx" ON "clinic_verification_documents"("clinic_id", "status");

-- CreateIndex
CREATE INDEX "clinic_verification_documents_reviewed_by_id_idx" ON "clinic_verification_documents"("reviewed_by_id");

-- CreateIndex
CREATE INDEX "patient_documents_patient_id_uploaded_at_idx" ON "patient_documents"("patient_id", "uploaded_at");

-- AddForeignKey
ALTER TABLE "clinic_verification_documents" ADD CONSTRAINT "clinic_verification_documents_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_verification_documents" ADD CONSTRAINT "clinic_verification_documents_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_documents" ADD CONSTRAINT "patient_documents_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
