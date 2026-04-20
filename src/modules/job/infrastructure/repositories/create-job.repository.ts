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

    const plainJob = createdJob.toObject() as {
      _id: { toString(): string };
      slug: string;
      companyId: string;
      title: string;
      description: string;
      slots: number;
      requirements?: CreateJobOutputDto['requirements'];
      benefits?: CreateJobOutputDto['benefits'];
      status: CreateJobOutputDto['status'];
      createdAt?: Date;
      updatedAt?: Date;
    };

    return {
      id: plainJob._id.toString(),
      slug: plainJob.slug,
      companyId: plainJob.companyId,
      title: plainJob.title,
      description: plainJob.description,
      slots: plainJob.slots,
      requirements: plainJob.requirements,
      benefits: plainJob.benefits,
      status: plainJob.status,
      createdAt: plainJob.createdAt,
      updatedAt: plainJob.updatedAt,
    };
  }
}
