import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { UpdateMyCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/update-my-company.repository.interface';
import type { UpdateMyCompanyInputDto } from '@src/modules/company/application/dto/input/update-my-company.input.dto';
import type { UpdateMyCompanyOutputDto } from '@src/modules/company/application/dto/output/update-my-company.output.dto';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { CnpjUtils } from '@src/shared/utils/cnpj.utils';

@Injectable()
export class UpdateMyCompanyRepository implements UpdateMyCompanyRepositoryInterface {
  private readonly cnpjUtils = new CnpjUtils();

  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanySchema>,
  ) {}

  async update(
    input: UpdateMyCompanyInputDto,
  ): Promise<UpdateMyCompanyOutputDto | null> {
    const updatedCompany = await this.companyModel
      .findOneAndUpdate(
        {
          'audit.createdByUserId': input.userId,
        },
        {
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.tradeName !== undefined && { tradeName: input.tradeName }),
          ...(input.legalName !== undefined && { legalName: input.legalName }),
          ...(input.contacts !== undefined && { contacts: input.contacts }),
          ...(input.documents !== undefined && {
            documents: {
              ...input.documents,
              ...(input.documents.cnpj !== undefined && {
                cnpj: this.cnpjUtils.normalize(input.documents.cnpj),
              }),
            },
          }),
          ...(input.media !== undefined && { media: input.media }),
        },
        {
          returnDocument: 'after',
        },
      )
      .lean()
      .exec();

    if (!updatedCompany) {
      return null;
    }

    return {
      _id: updatedCompany._id.toString(),
      slug: updatedCompany.slug,
      tradeName: updatedCompany.tradeName,
      legalName: updatedCompany.legalName,
      contacts: {
        email: updatedCompany.contacts.email,
        website: updatedCompany.contacts.website,
        phone: updatedCompany.contacts.phone,
        address: updatedCompany.contacts.address,
        social: updatedCompany.contacts.social,
      },
      documents: updatedCompany.documents,
      media: updatedCompany.media,
      audit: updatedCompany.audit
        ? {
            createdByUserId: updatedCompany.audit.createdByUserId,
          }
        : undefined,
      approval: updatedCompany.approval
        ? {
            approvedAt: updatedCompany.approval.approvedAt,
            approvedByUserId: updatedCompany.approval.approvedByUserId,
          }
        : undefined,
      status: updatedCompany.status,
      createdAt: updatedCompany.createdAt,
      updatedAt: updatedCompany.updatedAt,
    };
  }
}
