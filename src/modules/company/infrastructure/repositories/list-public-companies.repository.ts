import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';

import type { ListPublicCompaniesRepository as ListPublicCompaniesRepositoryContract } from '@src/modules/company/application/contracts/repositories/list-public-companies.repository';
import type { CompanyEntity } from '@src/modules/company/domain/entities/company.entity';
import {
  CompanySchema,
  CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

@Injectable()
export class ListPublicCompaniesRepository implements ListPublicCompaniesRepositoryContract {
  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async findPublicActiveCompanies(): Promise<CompanyEntity[]> {
    const companies = await this.companyModel
      .find({
        status: CompanyStatusEnum.ACTIVE,
      })
      .sort({ createdAt: -1 })
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
