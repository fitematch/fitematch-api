import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { ReadMyCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/read-my-company.repository.interface';
import type { ReadMyCompanyInputDto } from '@src/modules/company/application/dto/input/read-my-company.input.dto';
import type { ReadMyCompanyOutputDto } from '@src/modules/company/application/dto/output/read-my-company.output.dto';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { UserSchema } from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';

@Injectable()
export class ReadMyCompanyRepository implements ReadMyCompanyRepositoryInterface {
  constructor(
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanySchema>,

    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserSchema>,
  ) {}

  async read(
    input: ReadMyCompanyInputDto,
  ): Promise<ReadMyCompanyOutputDto | null> {
    const user = await this.userModel.findById(input.userId).lean().exec();

    const companyId = user?.recruiterProfile?.companyId;

    const company = companyId
      ? await this.companyModel.findById(companyId).lean().exec()
      : await this.companyModel
          .findOne({
            'audit.createdByUserId': input.userId,
          })
          .lean()
          .exec();

    if (!company) {
      return null;
    }

    return {
      _id: company._id.toString(),
      slug: company.slug,
      tradeName: company.tradeName,
      legalName: company.legalName,
      contacts: {
        email: company.contacts.email,
        website: company.contacts.website,
        phone: company.contacts.phone,
        address: company.contacts.address,
        social: company.contacts.social,
      },
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
