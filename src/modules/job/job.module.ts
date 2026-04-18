import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { jobProviders } from '@src/modules/job/infrastructure/providers/job.providers';
import {
  JobSchema,
  JobSchemaFactory,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import { ListJobController } from '@src/modules/job/adapters/http/controllers/list-job.controller';
import { CreateJobController } from '@src/modules/job/adapters/http/controllers/create-job.controller';
import { ReadJobController } from '@src/modules/job/adapters/http/controllers/read-job.controller';

const importedControllers = [
  ListJobController,
  CreateJobController,
  ReadJobController,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: JobSchema.name,
        schema: JobSchemaFactory,
      },
    ]),
  ],
  controllers: [...importedControllers],
  providers: [...jobProviders],
  exports: [...jobProviders, MongooseModule],
})
export class JobModule {}
