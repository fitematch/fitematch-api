import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import type { CompanyEntity } from '@src/modules/company/domain/entities/company.entity';
import {
  CompanySchema,
  CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { ListJobCompaniesRepository as ListJobCompaniesRepositoryContract } from '@src/modules/job/application/contracts/repositories/list-job-companies.repository';

@Injectable()
export class ListJobCompaniesRepository implements ListJobCompaniesRepositoryContract {
  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async findByIds(companyIds: string[]): Promise<CompanyEntity[]> {
    const companies = await this.companyModel
      .find({
        _id: { $in: companyIds },
      })
      .exec();

    return companies.map((company) => ({
      _id: company._id.toString(),
      slug: company.slug,
      tradeName: company.tradeName,
      legalName: company.legalName,
      contacts: company.contacts,
      documents: company.documents,
      media: company.media,
      audit: company.audit,
      approval: company.approval,
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));
  }
}
