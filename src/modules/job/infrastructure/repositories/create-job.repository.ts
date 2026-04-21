import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/create-job.repository.interface';
import type { CreateJobInputDto } from '@src/modules/job/application/dto/input/create-job.input.dto';
import type { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';

@Injectable()
export class CreateJobRepository implements CreateJobRepositoryInterface {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,
  ) {}

  async existsBySlug(slug: string): Promise<boolean> {
    const job = await this.jobModel.findOne({ slug }).lean().exec();

    return !!job;
  }

  async create(input: CreateJobInputDto): Promise<CreateJobOutputDto> {
    const createdJob = await this.jobModel.create({
      slug: input.slug,
      companyId: input.companyId,
      title: input.title,
      description: input.description,
      slots: input.slots,
      requirements: input.requirements,
      benefits: input.benefits,
      status: input.status,
    });

    return {
      _id: createdJob._id.toString(),
      slug: createdJob.slug,
      companyId: createdJob.companyId,
      title: createdJob.title,
      description: createdJob.description,
      slots: createdJob.slots,
      requirements:
        createdJob.requirements as CreateJobOutputDto['requirements'],
      benefits: createdJob.benefits as CreateJobOutputDto['benefits'],
      status: createdJob.status,
      createdAt: createdJob.createdAt,
      updatedAt: createdJob.updatedAt,
    };
  }
}
