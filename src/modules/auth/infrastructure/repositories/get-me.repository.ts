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

@Injectable()
export class GetMeRepository implements GetMeRepositoryInterface {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanyDocument>,
  ) {}

  public async findById(id: string): Promise<GetMeOutputDto | null> {
    const user = (await this.userModel.findById(id).lean().exec()) as
      | (LeanUser & Partial<Pick<GetMeOutputDto, 'permissions'>>)
      | null;

    if (!user) {
      return null;
    }

    const timestamps = user as typeof user & {
      createdAt?: Date;
      updatedAt?: Date;
    };
    const companyTradeName = user.recruiterProfile?.companyId
      ? await this.companyModel
          .findById(user.recruiterProfile.companyId)
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
            tradeName: companyTradeName,
          }
        : undefined,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
      createdAt: timestamps.createdAt,
      updatedAt: timestamps.updatedAt,
    };
  }
}
