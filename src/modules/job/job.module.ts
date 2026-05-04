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
import {
  UserSchema,
  UserSchemaFactory,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { ListJobController } from '@src/modules/job/adapters/http/controllers/list-job.controller';
import { CreateJobController } from '@src/modules/job/adapters/http/controllers/create-job.controller';
import { ReadJobController } from '@src/modules/job/adapters/http/controllers/read-job.controller';
import { UpdateJobController } from '@src/modules/job/adapters/http/controllers/update-job.controller';
import { DeleteJobController } from '@src/modules/job/adapters/http/controllers/delete-job.controller';
import { ListMyJobsController } from '@src/modules/job/adapters/http/controllers/list-my-jobs.controller';
import { CreateMyJobController } from '@src/modules/job/adapters/http/controllers/create-my-job.controller';
import { UpdateMyJobController } from '@src/modules/job/adapters/http/controllers/update-my-job.controller';
import { DeleteMyJobController } from '@src/modules/job/adapters/http/controllers/delete-my-job.controller';

const importedControllers = [
  ListJobController,
  ListMyJobsController,
  CreateMyJobController,
  UpdateMyJobController,
  DeleteMyJobController,
  CreateJobController,
  ReadJobController,
  UpdateJobController,
  DeleteJobController,
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
      {
        name: UserSchema.name,
        schema: UserSchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...jobProviders],
  exports: [...jobProviders, MongooseModule],
})
export class JobModule {}
