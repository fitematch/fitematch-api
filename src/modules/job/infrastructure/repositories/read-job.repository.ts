import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import type { ReadJobInputDto } from '@src/modules/job/application/dto/input/read-job.input.dto';
import type { ReadJobOutputDto } from '@src/modules/job/application/dto/output/read-job.output.dto';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';

@Injectable()
export class ReadJobRepository implements ReadJobRepositoryInterface {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,
  ) {}

  async read(input: ReadJobInputDto): Promise<ReadJobOutputDto | null> {
    const job = (await this.jobModel.findById(input._id).lean().exec()) as
      | (ReadJobOutputDto & { _id: { toString(): string } })
      | null;

    if (!job) {
      return null;
    }

    return {
      _id: job._id.toString(),
      slug: job.slug,
      companyId: job.companyId,
      title: job.title,
      description: job.description,
      slots: job.slots,
      requirements: job.requirements,
      benefits: job.benefits,
      media: job.media,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
