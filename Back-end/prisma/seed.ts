import {
  AppointmentStatus,
  AuditAction,
  BloodType,
  ClinicStaffRole,
  ConsultationType,
  DayOfWeek,
  DoctorStatus,
  Gender,
  MedicationForm,
  NotificationType,
  OrganizationStatus,
  PaymentStatus,
  PharmacyStaffRole,
  PrescriptionStatus,
  Prisma,
  PrismaClient,
  UserRole,
  UserStatus,
  VerificationDocumentStatus,
  VerificationDocumentType,
} from '@prisma/client';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD ?? 'MediLink123!';
const NOW = new Date('2026-08-07T09:00:00.000Z');

async function upsertUser(data: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  passwordHash: string;
}) {
  return prisma.user.upsert({
    where: { email: data.email },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: NOW,
      passwordHash: data.passwordHash,
      deletedAt: null,
      lockedUntil: null,
      failedLoginAttempts: 0,
    },
    create: {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      status: UserStatus.ACTIVE,
      emailVerifiedAt: NOW,
      passwordHash: data.passwordHash,
    },
  });
}

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    throw new Error('Refusing to seed production.');
  }

  console.log('🌱 Seeding MediLink DZ development database...');
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // 1) Locations
  const [alger, oran, constantine] = await Promise.all([
    prisma.wilaya.upsert({ where: { code: 16 }, update: { name: 'Alger' }, create: { code: 16, name: 'Alger' } }),
    prisma.wilaya.upsert({ where: { code: 31 }, update: { name: 'Oran' }, create: { code: 31, name: 'Oran' } }),
    prisma.wilaya.upsert({ where: { code: 25 }, update: { name: 'Constantine' }, create: { code: 25, name: 'Constantine' } }),
  ]);

  const [algerCentre, oranCentre, constantineCentre] = await Promise.all([
    prisma.commune.upsert({
      where: { wilayaId_name: { wilayaId: alger.id, name: 'Alger Centre' } },
      update: {}, create: { wilayaId: alger.id, name: 'Alger Centre' },
    }),
    prisma.commune.upsert({
      where: { wilayaId_name: { wilayaId: oran.id, name: 'Oran' } },
      update: {}, create: { wilayaId: oran.id, name: 'Oran' },
    }),
    prisma.commune.upsert({
      where: { wilayaId_name: { wilayaId: constantine.id, name: 'Constantine' } },
      update: {}, create: { wilayaId: constantine.id, name: 'Constantine' },
    }),
  ]);

  // 2) Users
  const admin = await upsertUser({
    email: 'admin@medilink.test', firstName: 'MediLink', lastName: 'Admin',
    phone: '+213555000001', role: UserRole.PLATFORM_ADMIN, passwordHash,
  });

  const patientUsers = await Promise.all([
    upsertUser({ email: 'patient1@medilink.test', firstName: 'Ahmed', lastName: 'Benali', phone: '+213555000101', role: UserRole.PATIENT, passwordHash }),
    upsertUser({ email: 'patient2@medilink.test', firstName: 'Lina', lastName: 'Mansouri', phone: '+213555000102', role: UserRole.PATIENT, passwordHash }),
    upsertUser({ email: 'patient3@medilink.test', firstName: 'Yacine', lastName: 'Boudiaf', phone: '+213555000103', role: UserRole.PATIENT, passwordHash }),
  ]);

  const doctorUsers = await Promise.all([
    upsertUser({ email: 'doctor1@medilink.test', firstName: 'Sarah', lastName: 'Amrani', phone: '+213555000201', role: UserRole.DOCTOR, passwordHash }),
    upsertUser({ email: 'doctor2@medilink.test', firstName: 'Karim', lastName: 'Belkacem', phone: '+213555000202', role: UserRole.DOCTOR, passwordHash }),
    upsertUser({ email: 'doctor3@medilink.test', firstName: 'Nadia', lastName: 'Rahmani', phone: '+213555000203', role: UserRole.DOCTOR, passwordHash }),
  ]);

  const pharmacyUsers = await Promise.all([
    upsertUser({ email: 'pharmacy1@medilink.test', firstName: 'Amel', lastName: 'Bensaid', phone: '+213555000301', role: UserRole.PHARMACY_STAFF, passwordHash }),
    upsertUser({ email: 'pharmacy2@medilink.test', firstName: 'Riad', lastName: 'Mebarki', phone: '+213555000302', role: UserRole.PHARMACY_STAFF, passwordHash }),
    upsertUser({ email: 'pharmacy3@medilink.test', firstName: 'Sofia', lastName: 'Bouzid', phone: '+213555000303', role: UserRole.PHARMACY_STAFF, passwordHash }),
  ]);

  const clinicUsers = await Promise.all([
    upsertUser({ email: 'clinic1@medilink.test', firstName: 'Samir', lastName: 'Ait Ali', phone: '+213555000401', role: UserRole.CLINIC_STAFF, passwordHash }),
    upsertUser({ email: 'clinic2@medilink.test', firstName: 'Nora', lastName: 'Kaci', phone: '+213555000402', role: UserRole.CLINIC_STAFF, passwordHash }),
    upsertUser({ email: 'clinic3@medilink.test', firstName: 'Walid', lastName: 'Haddad', phone: '+213555000403', role: UserRole.CLINIC_STAFF, passwordHash }),
  ]);

  // 3) Patients
  const patientData = [
    { user: patientUsers[0], dob: new Date('1990-04-12'), gender: Gender.MALE, bloodType: BloodType.O_POSITIVE, communeId: algerCentre.id, address: 'Alger Centre - demo address' },
    { user: patientUsers[1], dob: new Date('1995-11-20'), gender: Gender.FEMALE, bloodType: BloodType.A_POSITIVE, communeId: oranCentre.id, address: 'Oran - demo address' },
    { user: patientUsers[2], dob: new Date('1987-08-09'), gender: Gender.MALE, bloodType: BloodType.B_POSITIVE, communeId: constantineCentre.id, address: 'Constantine - demo address' },
  ];

  const patients = [];
  for (const p of patientData) {
    patients.push(await prisma.patient.upsert({
      where: { userId: p.user.id },
      update: { dateOfBirth: p.dob, gender: p.gender, bloodType: p.bloodType, communeId: p.communeId, addressLine: p.address, medicalNotes: 'Synthetic development data.' },
      create: { userId: p.user.id, dateOfBirth: p.dob, gender: p.gender, bloodType: p.bloodType, communeId: p.communeId, addressLine: p.address, medicalNotes: 'Synthetic development data.' },
    }));
  }

  const allergies = await Promise.all(['Pollen', 'Dust mites', 'Latex'].map(name =>
    prisma.allergy.upsert({ where: { name }, update: {}, create: { name } })
  ));
  const conditionNames = ['Hypertension', 'Asthma', 'Migraine'];
  const conditions = await Promise.all(conditionNames.map(name =>
    prisma.medicalCondition.upsert({ where: { name }, update: {}, create: { name, description: 'Synthetic development condition.' } })
  ));

  for (let i = 0; i < 3; i += 1) {
    await prisma.patientAllergy.upsert({
      where: { patientId_allergyId: { patientId: patients[i].id, allergyId: allergies[i].id } },
      update: { severity: i === 1 ? 'MODERATE' : 'MILD', notes: 'Synthetic development allergy.' },
      create: { patientId: patients[i].id, allergyId: allergies[i].id, severity: i === 1 ? 'MODERATE' : 'MILD', notes: 'Synthetic development allergy.' },
    });
    await prisma.patientCondition.upsert({
      where: { patientId_conditionId: { patientId: patients[i].id, conditionId: conditions[i].id } },
      update: { status: 'ACTIVE', notes: 'Synthetic development condition.' },
      create: { patientId: patients[i].id, conditionId: conditions[i].id, status: 'ACTIVE', notes: 'Synthetic development condition.' },
    });
  }

  // 4) Doctors + specialties + verification
  const specialties = await Promise.all([
    ['Cardiology', 'Heart and cardiovascular care.'],
    ['General Medicine', 'Primary and general medical care.'],
    ['Dermatology', 'Skin-related care.'],
  ].map(([name, description]) => prisma.specialty.upsert({
    where: { name }, update: { description }, create: { name, description },
  })));

  const doctorData = [
    { user: doctorUsers[0], license: 'DZ-DEMO-DR-001', experience: 12, price: '3000.00', bio: 'Demo cardiologist profile.' },
    { user: doctorUsers[1], license: 'DZ-DEMO-DR-002', experience: 8, price: '2500.00', bio: 'Demo general practitioner profile.' },
    { user: doctorUsers[2], license: 'DZ-DEMO-DR-003', experience: 10, price: '2800.00', bio: 'Demo dermatologist profile.' },
  ];

  const doctors = [];
  for (let i = 0; i < doctorData.length; i += 1) {
    const d = doctorData[i];
    const doctor = await prisma.doctor.upsert({
      where: { licenseNumber: d.license },
      update: { userId: d.user.id, yearsExperience: d.experience, defaultConsultationPrice: new Prisma.Decimal(d.price), bio: d.bio, status: DoctorStatus.APPROVED, profileCompleted: true, acceptsOnlineBooking: true, reviewedById: admin.id, reviewedAt: NOW, approvedAt: NOW },
      create: { userId: d.user.id, licenseNumber: d.license, yearsExperience: d.experience, defaultConsultationPrice: new Prisma.Decimal(d.price), bio: d.bio, status: DoctorStatus.APPROVED, profileCompleted: true, acceptsOnlineBooking: true, submittedAt: NOW, reviewedById: admin.id, reviewedAt: NOW, approvedAt: NOW },
    });
    doctors.push(doctor);

    await prisma.doctorSpecialty.upsert({
      where: { doctorId_specialtyId: { doctorId: doctor.id, specialtyId: specialties[i].id } },
      update: { isPrimary: true },
      create: { doctorId: doctor.id, specialtyId: specialties[i].id, isPrimary: true },
    });

    const doc = await prisma.doctorVerificationDocument.findFirst({
      where: { doctorId: doctor.id, type: VerificationDocumentType.MEDICAL_LICENSE },
    });
    if (doc) {
      await prisma.doctorVerificationDocument.update({ where: { id: doc.id }, data: { status: VerificationDocumentStatus.ACCEPTED, reviewedById: admin.id, reviewedAt: NOW } });
    } else {
      await prisma.doctorVerificationDocument.create({ data: { doctorId: doctor.id, type: VerificationDocumentType.MEDICAL_LICENSE, fileUrl: `https://example.test/doctors/${i + 1}/license.pdf`, status: VerificationDocumentStatus.ACCEPTED, reviewedById: admin.id, reviewedAt: NOW } });
    }
  }

  // 5) Clinics + clinic staff + doctor availability
  const clinicData = [
    { slug: 'clinique-el-amal-demo', name: 'Clinique El Amal', communeId: algerCentre.id, address: 'Alger Centre - demo clinic', lat: '36.753800', lng: '3.058800', price: '3200.00' },
    { slug: 'clinique-es-salam-demo', name: 'Clinique Es Salam', communeId: oranCentre.id, address: 'Oran - demo clinic', lat: '35.697100', lng: '-0.630800', price: '2600.00' },
    { slug: 'clinique-el-hayat-demo', name: 'Clinique El Hayat', communeId: constantineCentre.id, address: 'Constantine - demo clinic', lat: '36.365000', lng: '6.614700', price: '3000.00' },
  ];
  const clinics = [];
  for (let i = 0; i < 3; i += 1) {
    const d = clinicData[i];
    const clinic = await prisma.clinic.upsert({
      where: { slug: d.slug },
      update: { name: d.name, communeId: d.communeId, addressLine: d.address, latitude: new Prisma.Decimal(d.lat), longitude: new Prisma.Decimal(d.lng), status: OrganizationStatus.APPROVED, reviewedById: admin.id, reviewedAt: NOW, approvedAt: NOW, deletedAt: null },
      create: { slug: d.slug, name: d.name, communeId: d.communeId, addressLine: d.address, latitude: new Prisma.Decimal(d.lat), longitude: new Prisma.Decimal(d.lng), status: OrganizationStatus.APPROVED, submittedAt: NOW, reviewedById: admin.id, reviewedAt: NOW, approvedAt: NOW },
    });
    clinics.push(clinic);
    await prisma.clinicStaff.upsert({
      where: { userId_clinicId: { userId: clinicUsers[i].id, clinicId: clinic.id } },
      update: { role: i === 0 ? ClinicStaffRole.MANAGER : ClinicStaffRole.RECEPTIONIST, isActive: true },
      create: { userId: clinicUsers[i].id, clinicId: clinic.id, role: i === 0 ? ClinicStaffRole.MANAGER : ClinicStaffRole.RECEPTIONIST, isActive: true },
    });
    await prisma.doctorClinic.upsert({
      where: { doctorId_clinicId: { doctorId: doctors[i].id, clinicId: clinic.id } },
      update: { isPrimary: true, consultationPrice: new Prisma.Decimal(d.price), acceptsOnlineBooking: true },
      create: { doctorId: doctors[i].id, clinicId: clinic.id, isPrimary: true, consultationPrice: new Prisma.Decimal(d.price), acceptsOnlineBooking: true },
    });
    await prisma.doctorAvailability.upsert({
      where: { doctorId_clinicId_dayOfWeek_startMinute: { doctorId: doctors[i].id, clinicId: clinic.id, dayOfWeek: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY][i], startMinute: 540 } },
      update: { endMinute: 1020, slotDurationMinutes: 30, isActive: true },
      create: { doctorId: doctors[i].id, clinicId: clinic.id, dayOfWeek: [DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY][i], startMinute: 540, endMinute: 1020, slotDurationMinutes: 30, isActive: true },
    });
  }

  // 6) Pharmacies + staff + medications + 3x3 inventory matrix
  const pharmacyData = [
    { slug: 'pharmacie-centrale-demo', name: 'Pharmacie Centrale', communeId: algerCentre.id, address: 'Alger Centre - demo pharmacy', lat: '36.755000', lng: '3.060000', open24: true },
    { slug: 'pharmacie-el-chifa-demo', name: 'Pharmacie El Chifa', communeId: oranCentre.id, address: 'Oran - demo pharmacy', lat: '35.699000', lng: '-0.628000', open24: false },
    { slug: 'pharmacie-ennasr-demo', name: 'Pharmacie Ennasr', communeId: constantineCentre.id, address: 'Constantine - demo pharmacy', lat: '36.367000', lng: '6.617000', open24: false },
  ];
  const pharmacies = [];
  for (let i = 0; i < 3; i += 1) {
    const d = pharmacyData[i];
    const pharmacy = await prisma.pharmacy.upsert({
      where: { slug: d.slug },
      update: { name: d.name, communeId: d.communeId, addressLine: d.address, latitude: new Prisma.Decimal(d.lat), longitude: new Prisma.Decimal(d.lng), isOpen24Hours: d.open24, status: OrganizationStatus.APPROVED, reviewedById: admin.id, reviewedAt: NOW, approvedAt: NOW, deletedAt: null },
      create: { slug: d.slug, name: d.name, communeId: d.communeId, addressLine: d.address, latitude: new Prisma.Decimal(d.lat), longitude: new Prisma.Decimal(d.lng), isOpen24Hours: d.open24, status: OrganizationStatus.APPROVED, submittedAt: NOW, reviewedById: admin.id, reviewedAt: NOW, approvedAt: NOW },
    });
    pharmacies.push(pharmacy);
    await prisma.pharmacyStaff.upsert({
      where: { userId_pharmacyId: { userId: pharmacyUsers[i].id, pharmacyId: pharmacy.id } },
      update: { role: i === 0 ? PharmacyStaffRole.PHARMACIST : PharmacyStaffRole.MANAGER, isActive: true },
      create: { userId: pharmacyUsers[i].id, pharmacyId: pharmacy.id, role: i === 0 ? PharmacyStaffRole.PHARMACIST : PharmacyStaffRole.MANAGER, isActive: true },
    });
    await prisma.pharmacyOpeningHour.upsert({
      where: { pharmacyId_dayOfWeek: { pharmacyId: pharmacy.id, dayOfWeek: DayOfWeek.FRIDAY } },
      update: { opensAtMinute: d.open24 ? 0 : 480, closesAtMinute: d.open24 ? 1439 : 1200, isClosed: false },
      create: { pharmacyId: pharmacy.id, dayOfWeek: DayOfWeek.FRIDAY, opensAtMinute: d.open24 ? 0 : 480, closesAtMinute: d.open24 ? 1439 : 1200, isClosed: false },
    });
  }

  const medications = await Promise.all([
    prisma.medication.upsert({ where: { slug: 'paracetamol-500mg-demo' }, update: { isActive: true }, create: { slug: 'paracetamol-500mg-demo', genericName: 'Paracetamol', brandName: 'Demo Paracetamol', form: MedicationForm.TABLET, strength: '500 mg', requiresPrescription: false } }),
    prisma.medication.upsert({ where: { slug: 'amoxicillin-500mg-demo' }, update: { isActive: true }, create: { slug: 'amoxicillin-500mg-demo', genericName: 'Amoxicillin', brandName: 'Demo Amoxicillin', form: MedicationForm.CAPSULE, strength: '500 mg', requiresPrescription: true } }),
    prisma.medication.upsert({ where: { slug: 'ibuprofen-400mg-demo' }, update: { isActive: true }, create: { slug: 'ibuprofen-400mg-demo', genericName: 'Ibuprofen', brandName: 'Demo Ibuprofen', form: MedicationForm.TABLET, strength: '400 mg', requiresPrescription: false } }),
  ]);
  const stock = [[100, 40, 60], [70, 0, 30], [50, 25, 0]];
  const prices = ['180', '420', '260'];
  for (let p = 0; p < 3; p += 1) {
    for (let m = 0; m < 3; m += 1) {
      await prisma.pharmacyInventory.upsert({
        where: { pharmacyId_medicationId: { pharmacyId: pharmacies[p].id, medicationId: medications[m].id } },
        update: { stockQuantity: stock[p][m], reservedQuantity: 0, unitPrice: new Prisma.Decimal(prices[m]), lastVerifiedAt: NOW },
        create: { pharmacyId: pharmacies[p].id, medicationId: medications[m].id, stockQuantity: stock[p][m], reservedQuantity: 0, unitPrice: new Prisma.Decimal(prices[m]), lastVerifiedAt: NOW },
      });
    }
  }

  // 7) Appointments + payments + records + prescriptions
  const times = [new Date('2026-08-01T09:00:00Z'), new Date('2026-08-02T10:00:00Z'), new Date('2026-08-03T11:00:00Z')];
  const appointments = [];
  for (let i = 0; i < 3; i += 1) {
    let appointment = await prisma.appointment.findFirst({ where: { patientId: patients[i].id, doctorId: doctors[i].id, scheduledAt: times[i] } });
    if (!appointment) {
      appointment = await prisma.appointment.create({ data: { patientId: patients[i].id, doctorId: doctors[i].id, clinicId: clinics[i].id, createdById: patientUsers[i].id, scheduledAt: times[i], durationMinutes: 30, type: ConsultationType.IN_PERSON, status: AppointmentStatus.COMPLETED, reason: 'Synthetic completed consultation.', confirmedAt: times[i], completedAt: new Date(times[i].getTime() + 30 * 60 * 1000) } });
    }
    appointments.push(appointment);

    await prisma.payment.upsert({
      where: { providerReference: `DEMO-PAY-${i + 1}` },
      update: { appointmentId: appointment.id, payerId: patientUsers[i].id, amount: new Prisma.Decimal(['3200','2600','3000'][i]), status: PaymentStatus.PAID, provider: 'DEMO_GATEWAY', paidAt: times[i] },
      create: { appointmentId: appointment.id, payerId: patientUsers[i].id, amount: new Prisma.Decimal(['3200','2600','3000'][i]), currency: 'DZD', status: PaymentStatus.PAID, provider: 'DEMO_GATEWAY', providerReference: `DEMO-PAY-${i + 1}`, paidAt: times[i] },
    });

    const record = await prisma.medicalRecord.upsert({
      where: { appointmentId: appointment.id },
      update: { title: `Demo consultation ${i + 1}`, symptoms: 'Synthetic symptoms.', diagnosis: 'Synthetic assessment.', notes: 'Not real medical information.' },
      create: { appointmentId: appointment.id, title: `Demo consultation ${i + 1}`, symptoms: 'Synthetic symptoms.', diagnosis: 'Synthetic assessment.', notes: 'Not real medical information.' },
    });

    let prescription = await prisma.prescription.findFirst({ where: { medicalRecordId: record.id, instructions: `DEMO_PRESCRIPTION_${i + 1}` } });
    if (!prescription) {
      prescription = await prisma.prescription.create({ data: { medicalRecordId: record.id, status: PrescriptionStatus.ACTIVE, issuedAt: times[i], validUntil: new Date('2026-09-30'), instructions: `DEMO_PRESCRIPTION_${i + 1}` } });
    }
    const existingItem = await prisma.prescriptionItem.findFirst({ where: { prescriptionId: prescription.id, medicationId: medications[i].id } });
    if (!existingItem) {
      await prisma.prescriptionItem.create({ data: { prescriptionId: prescription.id, medicationId: medications[i].id, medicationName: medications[i].genericName, brandName: medications[i].brandName, strength: medications[i].strength, form: medications[i].form, dosage: 'Demo dosage', frequency: 'Demo frequency', quantity: 10 + i * 5, durationDays: 7, route: 'Oral - demo' } });
    }
  }

  // 8) Notifications + audit logs
  for (let i = 0; i < 3; i += 1) {
    const title = `Demo notification ${i + 1}`;
    const exists = await prisma.notification.findFirst({ where: { userId: patientUsers[i].id, appointmentId: appointments[i].id, title } });
    if (!exists) {
      await prisma.notification.create({ data: { userId: patientUsers[i].id, appointmentId: appointments[i].id, type: [NotificationType.APPOINTMENT, NotificationType.PRESCRIPTION, NotificationType.PHARMACY][i], title, body: 'Synthetic notification created by the seed.' } });
    }
  }

  const auditTargets = [{ type: 'Doctor', id: doctors[0].id }, { type: 'Clinic', id: clinics[0].id }, { type: 'Pharmacy', id: pharmacies[0].id }];
  for (const target of auditTargets) {
    const exists = await prisma.auditLog.findFirst({ where: { actorId: admin.id, action: AuditAction.APPROVE, entityType: target.type, entityId: target.id } });
    if (!exists) {
      await prisma.auditLog.create({ data: { actorId: admin.id, action: AuditAction.APPROVE, entityType: target.type, entityId: target.id, metadata: { source: 'development-seed' }, ipAddress: '127.0.0.1', userAgent: 'MediLink seed' } });
    }
  }

  console.log('✅ Seed completed successfully.');
  console.log('Demo password:', DEMO_PASSWORD);
  console.log('Accounts: admin@medilink.test, patient1..3@medilink.test, doctor1..3@medilink.test, pharmacy1..3@medilink.test, clinic1..3@medilink.test');
}

main()
  .catch((error: unknown) => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });