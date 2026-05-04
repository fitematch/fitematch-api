import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { UserSchema } from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import type { UpdateMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-my-job.repository.interface';
import type { UpdateMyJobInputDto } from '@src/modules/job/application/dto/input/update-my-job.input.dto';
import type { UpdateMyJobOutputDto } from '@src/modules/job/application/dto/output/update-my-job.output.dto';
import { SlugUtils } from '@src/shared/utils/slug.utils';

@Injectable()
export class UpdateMyJobRepository implements UpdateMyJobRepositoryInterface {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,

    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanySchema>,

    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserSchema>,
  ) {}

  async findRecruiterCompanyId(userId: string): Promise<string | null> {
    const user = await this.userModel.findById(userId).lean().exec();

    if (user?.recruiterProfile?.companyId) {
      return user.recruiterProfile.companyId;
    }

    const company = await this.companyModel
      .findOne({ 'audit.createdByUserId': userId }, { _id: 1 })
      .lean()
      .exec();

    if (!company) {
      return null;
    }

    const companyId = company._id.toString();

    await this.userModel
      .findByIdAndUpdate(userId, {
        $set: { 'recruiterProfile.companyId': companyId },
      })
      .exec();

    return companyId;
  }

  async update(
    input: UpdateMyJobInputDto & { companyId: string },
  ): Promise<UpdateMyJobOutputDto | null> {
    const updatedJob = (await this.jobModel
      .findOneAndUpdate(
        {
          _id: input._id,
          companyId: input.companyId,
        },
        {
          ...(input.title !== undefined && {
            title: input.title,
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
      .exec()) as
      | (UpdateMyJobOutputDto & { _id: { toString(): string } })
      | null;

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
