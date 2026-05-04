import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateMyCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/create-my-company.repository.interface';
import type { CreateMyCompanyInputDto } from '@src/modules/company/application/dto/input/create-my-company.input.dto';
import type { CreateMyCompanyOutputDto } from '@src/modules/company/application/dto/output/create-my-company.output.dto';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { UserSchema } from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';
import { CnpjUtils } from '@src/shared/utils/cnpj.utils';

@Injectable()
export class CreateMyCompanyRepository implements CreateMyCompanyRepositoryInterface {
  private readonly cnpjUtils = new CnpjUtils();

  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanySchema>,

    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserSchema>,
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

  async existsByCreatedByUserId(userId: string): Promise<boolean> {
    const company = await this.companyModel
      .findOne({ 'audit.createdByUserId': userId })
      .lean()
      .exec();

    return !!company;
  }

  async create(
    input: CreateMyCompanyInputDto,
  ): Promise<CreateMyCompanyOutputDto> {
    const createdCompanyDocument = await this.companyModel.create({
      slug: input.slug,
      tradeName: input.tradeName,
      legalName: input.legalName,
      contacts: input.contacts,
      documents: {
        ...input.documents,
        cnpj: this.cnpjUtils.normalize(input.documents.cnpj),
      },
      media: input.media,
      audit: {
        createdByUserId: input.userId,
      },
      approval: undefined,
      status: CompanyStatusEnum.PENDING,
    });

    const createdCompany = createdCompanyDocument.toObject();
    const createdCompanyId = createdCompany._id.toString();

    await this.userModel
      .findByIdAndUpdate(
        input.userId,
        {
          $set: {
            'recruiterProfile.companyId': createdCompanyId,
          },
        },
        {
          returnDocument: 'after',
        },
      )
      .exec();

    return {
      _id: createdCompanyId,
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
}
