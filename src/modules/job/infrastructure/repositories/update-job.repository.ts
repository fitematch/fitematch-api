import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import type { UpdateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-job.repository.interface';
import type { UpdateJobInputDto } from '@src/modules/job/application/dto/input/update-job.input.dto';
import type { UpdateJobOutputDto } from '@src/modules/job/application/dto/output/update-job.output.dto';
import { SlugUtils } from '@src/shared/utils/slug.utils';

@Injectable()
export class UpdateJobRepository implements UpdateJobRepositoryInterface {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,
  ) {}

  async update(input: UpdateJobInputDto): Promise<UpdateJobOutputDto | null> {
    const updated = (await this.jobModel
      .findByIdAndUpdate(
        input._id,
        {
          ...(input.companyId !== undefined && { companyId: input.companyId }),
          ...(input.title !== undefined && { title: input.title }),
          ...(input.title !== undefined && {
            normalizedTitle: SlugUtils.generate(input.title),
          }),
          ...(input.description !== undefined && {
            description: input.description,
          }),
          ...(input.slots !== undefined && { slots: input.slots }),
          ...(input.requirements !== undefined && {
            requirements: input.requirements,
          }),
          ...(input.benefits !== undefined && { benefits: input.benefits }),
          ...(input.media !== undefined && { media: input.media }),
          ...(input.status !== undefined && { status: input.status }),
        },
        { returnDocument: 'after' },
      )
      .lean()
      .exec()) as (UpdateJobOutputDto & { _id: { toString(): string } }) | null;

    if (!updated) return null;

    return {
      _id: updated._id.toString(),
      slug: updated.slug,
      companyId: updated.companyId,
      title: updated.title,
      description: updated.description,
      slots: updated.slots,
      requirements: updated.requirements,
      benefits: updated.benefits,
      media: updated.media,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
