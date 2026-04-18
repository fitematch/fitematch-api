import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { jobProviders } from '@src/modules/job/infrastructure/providers/job.providers';
import {
  JobSchema,
  JobSchemaFactory,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import { ListJobController } from '@src/modules/job/adapters/http/controllers/list-job.controller';

const importedControllers = [ListJobController];

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
