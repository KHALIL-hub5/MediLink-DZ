-- CreateEnum
CREATE TYPE "UploadCategory" AS ENUM ('AVATAR', 'DOCTOR_LICENSE', 'DOCTOR_DIPLOMA', 'PHARMACY_LICENSE', 'PHARMACY_DOCUMENT', 'MEDICAL_DOCUMENT', 'PRESCRIPTION', 'OTHER');

-- CreateTable
CREATE TABLE "pharmacy_verification_documents" (
    "id" UUID NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "type" "VerificationDocumentType" NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "status" "VerificationDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "reviewed_by_id" UUID,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "pharmacy_verification_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_uploads" (
    "id" UUID NOT NULL,
    "uploaded_by_id" UUID NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "original_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "category" "UploadCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pharmacy_verification_documents_pharmacy_id_status_idx" ON "pharmacy_verification_documents"("pharmacy_id", "status");

-- CreateIndex
CREATE INDEX "file_uploads_uploaded_by_id_idx" ON "file_uploads"("uploaded_by_id");

-- CreateIndex
CREATE INDEX "file_uploads_category_idx" ON "file_uploads"("category");

-- AddForeignKey
ALTER TABLE "pharmacy_verification_documents" ADD CONSTRAINT "pharmacy_verification_documents_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy_verification_documents" ADD CONSTRAINT "pharmacy_verification_documents_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
