import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { DashboardSummaryRepositoryInterface } from '@src/modules/dashboard/application/contracts/repositories/dashboard-summary.repository.interface';
import type { DashboardSummaryOutputDto } from '@src/modules/dashboard/application/dto/output/dashboard-summary.output.dto';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import {
  CompanySchema,
  type CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import {
  JobSchema,
  type JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import {
  ApplySchema,
  type ApplyDocument,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';

@Injectable()
export class DashboardSummaryRepository implements DashboardSummaryRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,
    @InjectModel(ApplySchema.name)
    private readonly applyModel: Model<ApplyDocument>,
  ) {}

  async summary(): Promise<DashboardSummaryOutputDto> {
    const lastWeekDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      usersTotal,
      usersLastWeek,
      companiesTotal,
      companiesLastWeek,
      jobsTotal,
      jobsLastWeek,
      applicationsTotal,
      applicationsLastWeek,
    ] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.userModel
        .countDocuments({ createdAt: { $gte: lastWeekDate } })
        .exec(),
      this.companyModel.countDocuments().exec(),
      this.companyModel
        .countDocuments({ createdAt: { $gte: lastWeekDate } })
        .exec(),
      this.jobModel.countDocuments().exec(),
      this.jobModel
        .countDocuments({ createdAt: { $gte: lastWeekDate } })
        .exec(),
      this.applyModel.countDocuments().exec(),
      this.applyModel
        .countDocuments({ createdAt: { $gte: lastWeekDate } })
        .exec(),
    ]);

    return {
      users: {
        total: usersTotal,
        lastWeek: usersLastWeek,
      },
      companies: {
        total: companiesTotal,
        lastWeek: companiesLastWeek,
      },
      jobs: {
        total: jobsTotal,
        lastWeek: jobsLastWeek,
      },
      applications: {
        total: applicationsTotal,
        lastWeek: applicationsLastWeek,
      },
    };
  }
}
