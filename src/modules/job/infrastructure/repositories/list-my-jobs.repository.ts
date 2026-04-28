import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import type { ListMyJobsRepository as ListMyJobsRepositoryContract } from '@src/modules/job/application/contracts/repositories/list-my-jobs.repository';
import type { JobEntity } from '@src/modules/job/domain/entities/job.entity';
import {
  JobSchema,
  JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import { JobDatabaseMapper } from '@src/modules/job/infrastructure/database/mapper/job-database.mapper';

@Injectable()
export class ListMyJobsRepository implements ListMyJobsRepositoryContract {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,
  ) {}

  async findByCompanyId(companyId: string): Promise<JobEntity[]> {
    const jobs = await this.jobModel
      .find({
        companyId,
      })
      .sort({ createdAt: -1 })
      .exec();

    return jobs.map((job) => JobDatabaseMapper.toEntity(job));
  }
}
