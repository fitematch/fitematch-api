import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import type { UpdateMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-my-job.repository.interface';
import type { UpdateMyJobInputDto } from '@src/modules/job/application/dto/input/update-my-job.input.dto';
import type { UpdateMyJobOutputDto } from '@src/modules/job/application/dto/output/update-my-job.output.dto';
import { SlugUtils } from '@src/shared/utils/slug.utils';
import { CompanyMembershipService } from '@src/modules/company/infrastructure/services/company-membership.service';
import { CompanyMembershipRoleEnum } from '@src/modules/company/domain/enums/company-membership-role.enum';

@Injectable()
export class UpdateMyJobRepository implements UpdateMyJobRepositoryInterface {
  constructor(
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,

    private readonly companyMembershipService: CompanyMembershipService,
  ) {}

  async findRecruiterCompanyId(userId: string): Promise<string | null> {
    const companyId =
      await this.companyMembershipService.getUserActiveCompanyId(userId);

    if (!companyId) {
      return null;
    }

    const canManageJobs =
      await this.companyMembershipService.userHasCompanyRole(
        userId,
        companyId,
        [
          CompanyMembershipRoleEnum.OWNER,
          CompanyMembershipRoleEnum.ADMIN,
          CompanyMembershipRoleEnum.RECRUITER,
        ],
      );

    return canManageJobs ? companyId : null;
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
