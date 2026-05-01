import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import type { UpdateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-job.repository.interface';
import type { UpdateJobInputDto } from '@src/modules/job/application/dto/input/update-job.input.dto';
import type { ReadJobOutputDto } from '@src/modules/job/application/dto/output/read-job.output.dto';
import type { UpdateJobOutputDto } from '@src/modules/job/application/dto/output/update-job.output.dto';

@Injectable()
export class UpdateJobRepository implements UpdateJobRepositoryInterface {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,
  ) {}

  async readById(_id: string): Promise<ReadJobOutputDto | null> {
    const job = (await this.jobModel.findById(_id).lean().exec()) as
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
      contractType: job.contractType,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }

  async update(input: UpdateJobInputDto): Promise<UpdateJobOutputDto | null> {
    const updatedJob = (await this.jobModel
      .findByIdAndUpdate(
        input._id,
        {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
          ...(input.slots !== undefined && { slots: input.slots }),
          ...(input.requirements !== undefined && {
            requirements: input.requirements,
          }),
          ...(input.benefits !== undefined && { benefits: input.benefits }),
          ...(input.media !== undefined && { media: input.media }),
          ...(input.contractType !== undefined && {
            contractType: input.contractType,
          }),
          ...(input.status !== undefined && { status: input.status }),
        },
        {
          returnDocument: 'after',
        },
      )
      .lean()
      .exec()) as (UpdateJobOutputDto & { _id: { toString(): string } }) | null;

    if (!updatedJob) {
      return null;
    }

    return {
      _id: updatedJob._id.toString(),
      slug: updatedJob.slug,
      companyId: updatedJob.companyId,
      title: updatedJob.title,
      description: updatedJob.description,
      slots: updatedJob.slots,
      requirements: updatedJob.requirements,
      benefits: updatedJob.benefits,
      media: updatedJob.media,
      contractType: updatedJob.contractType,
      status: updatedJob.status,
      createdAt: updatedJob.createdAt,
      updatedAt: updatedJob.updatedAt,
    };
  }
}
