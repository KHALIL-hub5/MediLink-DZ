import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from "@nestjs/common";

import {
  UserRole,
} from "@prisma/client";

import {
  AdminService,
} from "./admin.service";

import {
  Roles,
} from "../auth/decorators/roles.decorator";

import {
  CurrentUser,
} from "../auth/decorators/current-user.decorator";

import {
  ReviewDocumentDto,
} from "./dto/review-document.dto";

import {
  DocumentsQueryDto,
} from "./dto/documents-query.dto";

type AdminActor = {
  id: string;
  role: UserRole;
};

@Controller("admin")
@Roles(UserRole.PLATFORM_ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  // =====================================================
  // GENERAL DOCUMENT QUEUE
  // =====================================================

  @Get("documents/pending")
  getPendingDocuments() {
    return this.adminService.getPendingDocuments();
  }

  @Get("documents/stats")
  getDocumentStats() {
    return this.adminService.getDocumentStats();
  }

  // =====================================================
  // DOCTOR DOCUMENTS
  // =====================================================

  @Get("doctors/:doctorId/documents")
  getDoctorDocuments(
    @Param("doctorId", ParseUUIDPipe)
    doctorId: string,

    @Query()
    query: DocumentsQueryDto,
  ) {
    return this.adminService.getDoctorDocuments(
      doctorId,
      query,
    );
  }

  @Get("doctor-documents/:documentId")
  getDoctorDocument(
    @Param("documentId", ParseUUIDPipe)
    documentId: string,
  ) {
    return this.adminService.getDoctorDocument(
      documentId,
    );
  }

  @Patch("doctor-documents/:documentId/review")
  reviewDoctorDocument(
    @CurrentUser()
    admin: AdminActor,

    @Param("documentId", ParseUUIDPipe)
    documentId: string,

    @Body()
    dto: ReviewDocumentDto,
  ) {
    return this.adminService.reviewDoctorDocument(
      admin.id,
      documentId,
      dto,
    );
  }

  // =====================================================
  // CLINIC DOCUMENTS
  // =====================================================

  @Get("clinics/:clinicId/documents")
  getClinicDocuments(
    @Param("clinicId", ParseUUIDPipe)
    clinicId: string,

    @Query()
    query: DocumentsQueryDto,
  ) {
    return this.adminService.getClinicDocuments(
      clinicId,
      query,
    );
  }

  @Get("clinic-documents/:documentId")
  getClinicDocument(
    @Param("documentId", ParseUUIDPipe)
    documentId: string,
  ) {
    return this.adminService.getClinicDocument(
      documentId,
    );
  }

  @Patch("clinic-documents/:documentId/review")
  reviewClinicDocument(
    @CurrentUser()
    admin: AdminActor,

    @Param("documentId", ParseUUIDPipe)
    documentId: string,

    @Body()
    dto: ReviewDocumentDto,
  ) {
    return this.adminService.reviewClinicDocument(
      admin.id,
      documentId,
      dto,
    );
  }

  // =====================================================
  // PHARMACY DOCUMENTS
  // =====================================================

  @Get("pharmacies/:pharmacyId/documents")
  getPharmacyDocuments(
    @Param("pharmacyId", ParseUUIDPipe)
    pharmacyId: string,

    @Query()
    query: DocumentsQueryDto,
  ) {
    return this.adminService.getPharmacyDocuments(
      pharmacyId,
      query,
    );
  }

  @Get("pharmacy-documents/:documentId")
  getPharmacyDocument(
    @Param("documentId", ParseUUIDPipe)
    documentId: string,
  ) {
    return this.adminService.getPharmacyDocument(
      documentId,
    );
  }

  @Patch("pharmacy-documents/:documentId/review")
  reviewPharmacyDocument(
    @CurrentUser()
    admin: AdminActor,

    @Param("documentId", ParseUUIDPipe)
    documentId: string,

    @Body()
    dto: ReviewDocumentDto,
  ) {
    return this.adminService.reviewPharmacyDocument(
      admin.id,
      documentId,
      dto,
    );
  }

  // =====================================================
  // PATIENT DOCUMENTS
  // VIEW ONLY
  // =====================================================

  @Get("patients/:patientId/documents")
  getPatientDocuments(
    @Param("patientId", ParseUUIDPipe)
    patientId: string,
  ) {
    return this.adminService.getPatientDocuments(
      patientId,
    );
  }

  @Get("patient-documents/:documentId")
  getPatientDocument(
    @Param("documentId", ParseUUIDPipe)
    documentId: string,
  ) {
    return this.adminService.getPatientDocument(
      documentId,
    );
  }
}