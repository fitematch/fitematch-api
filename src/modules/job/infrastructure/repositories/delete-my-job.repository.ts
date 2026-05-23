import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import type { DeleteMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/delete-my-job.repository.interface';
import type { DeleteMyJobInputDto } from '@src/modules/job/application/dto/input/delete-my-job.input.dto';
import { CompanyMembershipService } from '@src/modules/company/infrastructure/services/company-membership.service';
import { CompanyMembershipRoleEnum } from '@src/modules/company/domain/enums/company-membership-role.enum';

@Injectable()
export class DeleteMyJobRepository implements DeleteMyJobRepositoryInterface {
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

  async delete(
    input: DeleteMyJobInputDto & { companyId: string },
  ): Promise<boolean> {
    const deletedJob = await this.jobModel
      .findOneAndDelete({
        _id: input._id,
        companyId: input.companyId,
      })
      .lean()
      .exec();

    return !!deletedJob;
  }
}
