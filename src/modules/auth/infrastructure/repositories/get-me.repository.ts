import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  UserSchema,
  type UserDocument,
} from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import {
  CompanySchema,
  type CompanyDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import type { LeanUser } from '@src/modules/user/infrastructure/database/types/user-lean.type';
import type { GetMeRepositoryInterface } from '@src/modules/auth/application/contracts/repositories/get-me.repository.interface';
import type { GetMeOutputDto } from '@src/modules/auth/application/dto/output/get-me.output.dto';
import { CompanyMembershipService } from '@src/modules/company/infrastructure/services/company-membership.service';

@Injectable()
export class GetMeRepository implements GetMeRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
    private readonly companyMembershipService: CompanyMembershipService,
  ) {}

  public async findById(id: string): Promise<GetMeOutputDto | null> {
    const user = (await this.userModel.findById(id).lean().exec()) as
      | (LeanUser & Partial<Pick<GetMeOutputDto, 'permissions'>>)
      | null;

    if (!user) {
      return null;
    }

    const activeCompanyId =
      await this.companyMembershipService.getUserActiveCompanyId(
        user._id.toString(),
      );
    const companyTradeName = activeCompanyId
      ? await this.companyModel
          .findById(activeCompanyId)
          .select('tradeName')
          .lean()
          .exec()
          .then((company) => company?.tradeName)
      : undefined;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split('T')[0]
        : undefined,
      candidateProfile: user.candidateProfile,
      recruiterProfile: user.recruiterProfile
        ? {
            ...user.recruiterProfile,
            companyId: activeCompanyId ?? user.recruiterProfile.companyId,
            tradeName: companyTradeName,
          }
        : undefined,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
