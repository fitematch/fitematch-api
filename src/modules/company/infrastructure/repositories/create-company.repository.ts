import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/create-company.repository.interface';
import type { CreateCompanyInputDto } from '@src/modules/company/application/dto/input/create-company.input.dto';
import type { CreateCompanyOutputDto } from '@src/modules/company/application/dto/output/create-company.output.dto';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { CnpjUtils } from '@src/shared/utils/cnpj.utils';
import { SlugUtils } from '@src/shared/utils/slug.utils';

@Injectable()
export class CreateCompanyRepository implements CreateCompanyRepositoryInterface {
  private readonly cnpjUtils = new CnpjUtils();

  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanySchema>,
  ) {}

  async existsBySlug(slug: string): Promise<boolean> {
    const company = await this.companyModel.findOne({ slug }).lean().exec();

    return !!company;
  }

  async existsByCnpj(cnpj: string): Promise<boolean> {
    const company = await this.companyModel
      .findOne({ 'documents.cnpj': cnpj })
      .lean()
      .exec();

    return !!company;
  }

  async create(input: CreateCompanyInputDto): Promise<CreateCompanyOutputDto> {
    const slug = await this.generateUniqueSlug(input.slug, input.tradeName);

    const createdCompanyDocument = await this.companyModel.create({
      slug,
      tradeName: input.tradeName,
      legalName: input.legalName,
      contacts: input.contacts,
      documents: {
        ...input.documents,
        cnpj: this.cnpjUtils.normalize(input.documents.cnpj),
      },
      media: input.media,
      audit: input.audit,
      approval: input.approval,
      status: input.status,
    });
    const createdCompany = createdCompanyDocument.toObject();

    return {
      _id: createdCompany._id.toString(),
      slug: createdCompany.slug,
      tradeName: createdCompany.tradeName,
      legalName: createdCompany.legalName,
      contacts: {
        email: createdCompany.contacts.email,
        website: createdCompany.contacts.website,
        phone: createdCompany.contacts.phone,
        address: createdCompany.contacts.address,
        social: createdCompany.contacts.social,
      },
      documents: createdCompany.documents,
      media: createdCompany.media,
      audit: createdCompany.audit
        ? {
            createdByUserId: createdCompany.audit.createdByUserId,
          }
        : undefined,
      approval: createdCompany.approval
        ? {
            approvedAt: createdCompany.approval.approvedAt,
            approvedByUserId: createdCompany.approval.approvedByUserId,
          }
        : undefined,
      status: createdCompany.status,
      createdAt: createdCompany.createdAt,
      updatedAt: createdCompany.updatedAt,
    };
  }

  private async generateUniqueSlug(
    providedSlug: string | undefined,
    tradeName: string,
  ): Promise<string> {
    const requestedSlug = SlugUtils.generate(providedSlug ?? '');
    const baseSlug = requestedSlug || SlugUtils.generate(tradeName);

    let slug = baseSlug;
    let counter = 1;

    while (await this.existsBySlug(slug)) {
      slug = SlugUtils.generateWithSuffix(baseSlug, counter);
      counter++;
    }

    return slug;
  }
}
