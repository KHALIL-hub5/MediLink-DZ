import { Module } from "@nestjs/common";

import { PharmaciesController } from "./pharmacies.controller";
import { PharmaciesService } from "./pharmacies.service";
import { UploadsModule } from "../uploads/uploads.module";

@Module({
  imports: [UploadsModule],
  controllers: [PharmaciesController],

  providers: [PharmaciesService],

  exports: [PharmaciesService],
})
export class PharmaciesModule {}
