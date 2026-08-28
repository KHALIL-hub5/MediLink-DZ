import { Global, Module } from "@nestjs/common";

import { ClinicsController } from "./clinics.controller";
import { ClinicsService } from "./clinics.service";
import { UploadsModule } from "../uploads/uploads.module";

@Global()
@Module({
  imports: [UploadsModule],
  controllers: [ClinicsController],

  providers: [ClinicsService],

  exports: [ClinicsService],
})
export class ClinicsModule {}
