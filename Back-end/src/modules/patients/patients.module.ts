import { Module } from "@nestjs/common";

import { PatientsController } from "./patients.controller";
import { PatientsService } from "./patients.service";
import { UploadsModule } from "../uploads/uploads.module";

@Module({
  imports: [UploadsModule],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
