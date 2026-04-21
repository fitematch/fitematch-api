import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/create-job.repository.interface';
import type { CreateJobInputDto } from '@src/modules/job/application/dto/input/create-job.input.dto';
import type { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import { SlugUtils } from '@src/shared/utils/slug.utils';

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

  async existsDuplicate(
    companyId: string,
    title: string,
    statuses: JobStatusEnum[],
  ): Promise<boolean> {
    const normalizedTitle = SlugUtils.generate(title);
    const job = await this.jobModel
      .findOne({
        companyId,
        normalizedTitle,
        status: { $in: statuses },
      })
      .lean()
      .exec();

    return !!job;
  }

  async create(input: CreateJobInputDto): Promise<CreateJobOutputDto> {
    try {
      const createdJob = await this.jobModel.create({
        slug: input.slug,
        companyId: input.companyId,
        title: input.title,
        normalizedTitle: SlugUtils.generate(input.title),
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
    } catch (error: unknown) {
      if (this.isDuplicateActiveTitleError(error)) {
        throw new ConflictException(
          'A job with the same title already exists for this company.',
        );
      }

      throw error;
    }
  }

  private isDuplicateActiveTitleError(error: unknown): boolean {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000 &&
      'keyPattern' in error &&
      typeof error.keyPattern === 'object' &&
      error.keyPattern !== null
    ) {
      const keyPattern = error.keyPattern as Record<string, unknown>;

      return (
        'companyId' in keyPattern &&
        'normalizedTitle' in keyPattern &&
        'status' in keyPattern
      );
    }

    return false;
  }
}
