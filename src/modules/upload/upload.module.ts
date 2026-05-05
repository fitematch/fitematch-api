import { Module } from '@nestjs/common';

import { UploadCompanyLogoController } from '@src/modules/upload/adapters/http/controllers/upload-company-logo.controller';
import { UploadJobCoverController } from '@src/modules/upload/adapters/http/controllers/upload-job-cover.controller';
import { UploadCandidateResumeController } from '@src/modules/upload/adapters/http/controllers/upload-candidate-resume.controller';
import { StorageModule } from '@src/shared/storage/storage.module';

const importedControllers = [
  UploadCompanyLogoController,
  UploadJobCoverController,
  UploadCandidateResumeController,
];

@Module({
  imports: [StorageModule],
  controllers: [...importedControllers],
})
export class UploadModule {}
