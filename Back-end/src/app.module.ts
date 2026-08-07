import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './database/prisma.module';

import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuthModule } from './modules/auth/auth.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { HealthModule } from './modules/health/health.module';
import { PatientsModule } from './modules/patients/patients.module';
import { PharmaciesModule } from './modules/pharmacies/pharmacies.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    PrismaModule,

    AuthModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    PharmaciesModule,
    HealthModule,
  ],
})
export class AppModule {}