import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import {
  CompanyMembershipSchema,
  type CompanyMembershipDocument,
} from '@src/modules/company/infrastructure/database/mongoose/schemas/company-membership.schema';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { UserSchema } from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import type { CompanyMembershipEntity } from '@src/modules/company/domain/entities/company-membership.entity';
import { CompanyMembershipRoleEnum } from '@src/modules/company/domain/enums/company-membership-role.enum';
import { CompanyMembershipStatusEnum } from '@src/modules/company/domain/enums/company-membership-status.enum';
import type { CompanyEntity } from '@src/modules/company/domain/entities/company.entity';

@Injectable()
export class CompanyMembershipService {
  constructor(
    @InjectModel(CompanyMembershipSchema.name)
    private readonly membershipModel: Model<CompanyMembershipDocument>,

    @InjectModel(CompanySchema.name)
    private readonly companyModel: Model<CompanySchema>,

    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserSchema>,
  ) {}

  async getUserCompanies(userId: string): Promise<CompanyEntity[]> {
    const memberships = await this.membershipModel
      .find({
        userId,
        status: CompanyMembershipStatusEnum.ACTIVE,
      })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    const companyIds = memberships.map((membership) => membership.companyId);

    if (companyIds.length === 0) {
      return [];
    }

    const companies = await this.companyModel
      .find({ _id: { $in: companyIds } })
      .lean()
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

  async getUserActiveCompany(userId: string): Promise<CompanyEntity | null> {
    const companyId = await this.getUserActiveCompanyId(userId);

    if (!companyId) {
      return null;
    }

    const company = await this.companyModel.findById(companyId).lean().exec();

    if (!company) {
      return null;
    }

    return {
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
    };
  }

  async getUserActiveCompanyId(
    userId: string,
    requestedCompanyId?: string,
  ): Promise<string | null> {
    if (requestedCompanyId) {
      const membership = await this.getUserCompanyMembership(
        userId,
        requestedCompanyId,
      );

      if (!membership) {
        return null;
      }

      await this.setLegacyActiveCompanyId(userId, requestedCompanyId);

      return requestedCompanyId;
    }

    const user = await this.userModel.findById(userId).lean().exec();
    const legacyCompanyId = user?.recruiterProfile?.companyId;

    if (
      legacyCompanyId &&
      (await this.userHasCompanyAccess(userId, legacyCompanyId))
    ) {
      return legacyCompanyId;
    }

    const membership = await this.membershipModel
      .findOne({
        userId,
        status: CompanyMembershipStatusEnum.ACTIVE,
      })
      .sort({ createdAt: 1 })
      .lean()
      .exec();

    if (membership) {
      await this.setLegacyActiveCompanyId(userId, membership.companyId);

      return membership.companyId;
    }

    const legacyCompany = await this.companyModel
      .findOne({ 'audit.createdByUserId': userId }, { _id: 1 })
      .lean()
      .exec();

    if (!legacyCompany) {
      return null;
    }

    const companyId = legacyCompany._id.toString();

    await this.ensureOwnerMembership(userId, companyId);
    await this.setLegacyActiveCompanyId(userId, companyId);

    return companyId;
  }

  async getUserCompanyMembership(
    userId: string,
    companyId: string,
  ): Promise<CompanyMembershipEntity | null> {
    const membership = await this.membershipModel
      .findOne({
        userId,
        companyId,
        status: CompanyMembershipStatusEnum.ACTIVE,
      })
      .lean()
      .exec();

    return membership ? this.toEntity(membership) : null;
  }

  async userHasCompanyAccess(
    userId: string,
    companyId: string,
  ): Promise<boolean> {
    return !!(await this.getUserCompanyMembership(userId, companyId));
  }

  async userHasCompanyRole(
    userId: string,
    companyId: string,
    role: CompanyMembershipRoleEnum | CompanyMembershipRoleEnum[],
  ): Promise<boolean> {
    const membership = await this.getUserCompanyMembership(userId, companyId);

    if (!membership) {
      return false;
    }

    const roles = Array.isArray(role) ? role : [role];

    return roles.includes(membership.role);
  }

  async ensureOwnerMembership(
    userId: string,
    companyId: string,
    invitedBy?: string,
  ): Promise<CompanyMembershipEntity> {
    const membership = await this.membershipModel
      .findOneAndUpdate(
        { userId, companyId },
        {
          $setOnInsert: {
            userId,
            companyId,
            role: CompanyMembershipRoleEnum.OWNER,
            status: CompanyMembershipStatusEnum.ACTIVE,
            invitedBy,
          },
        },
        {
          upsert: true,
          new: true,
        },
      )
      .lean()
      .exec();

    return this.toEntity(membership);
  }

  private async setLegacyActiveCompanyId(
    userId: string,
    companyId: string,
  ): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(userId, {
        $set: { 'recruiterProfile.companyId': companyId },
      })
      .exec();
  }

  private toEntity(
    membership: CompanyMembershipSchema & {
      _id: { toString(): string };
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): CompanyMembershipEntity {
    return {
      _id: membership._id.toString(),
      userId: membership.userId,
      companyId: membership.companyId,
      role: membership.role,
      status: membership.status,
      invitedBy: membership.invitedBy,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    };
  }
}
