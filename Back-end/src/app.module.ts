import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { PrismaModule } from "./database/prisma.module";

import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";

import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DoctorsModule } from "./modules/doctors/doctors.module";
import { HealthModule } from "./modules/health/health.module";
import { PatientsModule } from "./modules/patients/patients.module";
import { PharmaciesModule } from "./modules/pharmacies/pharmacies.module";
import { UsersModule } from "./modules/users/users.module";
import { AvailabilityModule } from "./modules/availability/availability.module";
import { MedicalRecordsModule } from "./modules/medical-records/medical-records.module";
import { PrescriptionsModule } from "./modules/prescriptions/prescriptions.module";
import { SpecialtiesModule } from "./modules/specialties/specialties.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    PrismaModule,
    AvailabilityModule,
    AuthModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
    SpecialtiesModule,
    AppointmentsModule,
    PrescriptionsModule,
    PharmaciesModule,
    HealthModule,
    MedicalRecordsModule,
  ],


  providers: [

    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },

  ],
})
export class AppModule {}