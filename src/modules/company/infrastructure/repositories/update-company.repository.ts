import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { UpdateCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/update-company.repository.interface';
import type { UpdateCompanyInputDto } from '@src/modules/company/application/dto/input/update-company.input.dto';
import type { UpdateCompanyOutputDto } from '@src/modules/company/application/dto/output/update-company.output.dto';
import {
  CompanySchema,
  type CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';

@Injectable()
export class UpdateCompanyRepository implements UpdateCompanyRepositoryInterface {
  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  async update(
    input: UpdateCompanyInputDto,
  ): Promise<UpdateCompanyOutputDto | null> {
    const updatedCompany = await this.companyModel
      .findByIdAndUpdate(
        input.id,
        {
          ...(input.slug !== undefined && { slug: input.slug }),
          ...(input.tradeName !== undefined && { tradeName: input.tradeName }),
          ...(input.legalName !== undefined && { legalName: input.legalName }),
          ...(input.contacts !== undefined && { contacts: input.contacts }),
          ...(input.documents !== undefined && { documents: input.documents }),
          ...(input.media !== undefined && { media: input.media }),
          ...(input.audit !== undefined && { audit: input.audit }),
          ...(input.approval !== undefined && { approval: input.approval }),
          ...(input.status !== undefined && { status: input.status }),
        },
        {
          new: true,
        },
      )
      .lean()
      .exec();

    if (!updatedCompany) {
      return null;
    }

    return {
      id: updatedCompany._id.toString(),
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
