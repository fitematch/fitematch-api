import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ReadCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/read-company.repository.interface';
import type { ReadCompanyInputDto } from '@src/modules/company/application/dto/input/read-company.input.dto';
import type { ReadCompanyOutputDto } from '@src/modules/company/application/dto/output/read-company.output.dto';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';

@Injectable()
export class ReadCompanyRepository implements ReadCompanyRepositoryInterface {
  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanySchema>,
  ) {}

  async read(input: ReadCompanyInputDto): Promise<ReadCompanyOutputDto | null> {
    const company = await this.companyModel.findById(input._id).lean().exec();

    if (!company) {
      return null;
    }

    return {
      _id: company._id.toString(),
      slug: company.slug,
      tradeName: company.tradeName,
      legalName: company.legalName,
      contacts: company.contacts
        ? {
            email: company.contacts.email,
            website: company.contacts.website,
            phone: company.contacts.phone,
            address: company.contacts.address,
            social: company.contacts.social,
          }
        : (undefined as never),
      documents: company.documents,
      media: company.media,
      audit: company.audit
        ? {
            createdByUserId: company.audit.createdByUserId,
          }
        : undefined,
      approval: company.approval
        ? {
            approvedAt: company.approval.approvedAt,
            approvedByUserId: company.approval.approvedByUserId,
          }
        : undefined,
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
