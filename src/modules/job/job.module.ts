import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { jobProviders } from '@src/modules/job/infrastructure/providers/job.providers';
import {
  JobSchema,
  JobSchemaFactory,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import {
  CompanySchema,
  CompanySchemaFactory,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { ListJobController } from '@src/modules/job/adapters/http/controllers/list-job.controller';
import { CreateJobController } from '@src/modules/job/adapters/http/controllers/create-job.controller';
import { ReadJobController } from '@src/modules/job/adapters/http/controllers/read-job.controller';
import { UpdateJobController } from './adapters/http/controllers/update-job.controller';
import { DeleteJobController } from '@src/modules/job/adapters/http/controllers/delete-job.controller';
import { ListMyJobsController } from '@src/modules/job/adapters/http/controllers/list-my-jobs.controller';

const importedControllers = [
  ListJobController,
  CreateJobController,
  ReadJobController,
  UpdateJobController,
  DeleteJobController,
  ListMyJobsController,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JobSchema.name,
        schema: JobSchemaFactory,
      },
      {
        name: CompanySchema.name,
        schema: CompanySchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...jobProviders],
  exports: [...jobProviders, MongooseModule],
})
export class JobModule {}
