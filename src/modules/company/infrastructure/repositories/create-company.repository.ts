import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/create-company.repository.interface';
import type { CreateCompanyInputDto } from '@src/modules/company/application/dto/input/create-company.input.dto';
import type { CreateCompanyOutputDto } from '@src/modules/company/application/dto/output/create-company.output.dto';
import {
  CompanySchema,
  type CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';

@Injectable()
export class CreateCompanyRepository implements CreateCompanyRepositoryInterface {
  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async create(input: CreateCompanyInputDto): Promise<CreateCompanyOutputDto> {
    const createdCompany = await this.companyModel.create({
      slug: input.slug,
      tradeName: input.tradeName,
      legalName: input.legalName,
      contacts: input.contacts,
      documents: input.documents,
      media: input.media,
      audit: input.audit,
      approval: input.approval,
      status: input.status,
    });

    return {
      id: createdCompany.id ?? createdCompany._id.toString(),
      slug: createdCompany.slug,
      tradeName: createdCompany.tradeName,
      legalName: createdCompany.legalName,
      contacts: createdCompany.contacts,
      documents: createdCompany.documents,
      media: createdCompany.media,
      audit: createdCompany.audit,
      approval: createdCompany.approval,
      status: createdCompany.status,
      createdAt: createdCompany.createdAt,
      updatedAt: createdCompany.updatedAt,
    };
  }
}
