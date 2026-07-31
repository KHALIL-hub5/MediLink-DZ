import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AppointmentsModule } from "./modules/appointments/appointments.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DoctorsModule } from "./modules/doctors/doctors.module";
import { HealthModule } from "./modules/health/health.module";
import { PatientsModule } from "./modules/patients/patients.module";
import { PharmaciesModule } from "./modules/pharmacies/pharmacies.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    PharmaciesModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
