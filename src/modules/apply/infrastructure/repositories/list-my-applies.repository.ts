import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import { ListMyAppliesRepository as ListMyAppliesRepositoryContract } from '@src/modules/apply/application/contracts/repositories/list-my-applies.repository';
import { ListMyAppliesRepositoryOutputDto } from '@src/modules/apply/application/dto/output/list-my-applies.repository-output.dto';
import {
  ApplySchema,
  ApplyDocument,
} from '@src/modules/apply/infrastructure/database/mongoose/schemas/apply.schema';
import {
  JobSchema,
  JobDocument,
} from '@src/modules/job/infrastructure/database/mongoose/schemas/job.schema';
import {
  CompanySchema,
  CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';

type ListMyAppliesLeanDocument = Omit<
  ListMyAppliesRepositoryOutputDto,
  '_id'
> & {
  _id: { toString(): string };
};

type JobSummary = {
  _id: { toString(): string };
  title: string;
  companyId: string;
};

type CompanySummary = {
  _id: { toString(): string };
  tradeName: string;
  media?: { logoUrl?: string };
};

@Injectable()
export class ListMyAppliesRepository implements ListMyAppliesRepositoryContract {
  constructor(
    @InjectModel(ApplySchema.name)
    private readonly applyModel: Model<ApplyDocument>,
    @InjectModel(JobSchema.name)
    private readonly jobModel: Model<JobDocument>,
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async findByUserId(
    userId: string,
  ): Promise<ListMyAppliesRepositoryOutputDto[]> {
    const applies = await this.applyModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean<ListMyAppliesLeanDocument[]>()
      .exec();

    const jobIds = [...new Set(applies.map((apply) => apply.jobId))];

    const jobs = await this.jobModel
      .find({ _id: { $in: jobIds } })
      .select({ _id: 1, title: 1, companyId: 1 })
      .lean<JobSummary[]>()
      .exec();

    const jobsById = new Map<string, { title: string; companyId: string }>(
      jobs.map((job) => [
        job._id.toString(),
        { title: job.title, companyId: job.companyId },
      ]),
    );

    const companyIds = [
      ...new Set(jobs.map((job) => job.companyId).filter(Boolean)),
    ];

    const companies = await this.companyModel
      .find({ _id: { $in: companyIds } })
      .select({ _id: 1, tradeName: 1, media: 1 })
      .lean<CompanySummary[]>()
      .exec();

    const companiesById = new Map<
      string,
      { tradeName: string; logoUrl: string }
    >(
      companies.map((company) => [
        company._id.toString(),
        {
          tradeName: company.tradeName,
          logoUrl: company.media?.logoUrl ?? '',
        },
      ]),
    );

    return applies.map((apply) => {
      const job = jobsById.get(apply.jobId);
      const company = job ? companiesById.get(job.companyId) : undefined;

      return {
        _id: apply._id.toString(),
        jobId: apply.jobId,
        userId: apply.userId,
        details: {
          jobTitle: job?.title ?? '',
          tradeName: company?.tradeName ?? '',
          logoUrl: company?.logoUrl ?? '',
        },
        status: apply.status,
        createdAt: apply.createdAt,
        updatedAt: apply.updatedAt,
      };
    });
  }
}
