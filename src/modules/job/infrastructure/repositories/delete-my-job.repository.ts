import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { UserSchema } from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import type { DeleteMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/delete-my-job.repository.interface';
import type { DeleteMyJobInputDto } from '@src/modules/job/application/dto/input/delete-my-job.input.dto';

@Injectable()
export class DeleteMyJobRepository implements DeleteMyJobRepositoryInterface {
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
