import type { Model } from 'mongoose';
import { CompanyMembershipService } from '@src/modules/company/infrastructure/services/company-membership.service';
import type { CompanyMembershipDocument } from '@src/modules/company/infrastructure/database/mongoose/schemas/company-membership.schema';
import { CompanySchema } from '@src/modules/company/infrastructure/database/mongoose/schemas/company.schema';
import { UserSchema } from '@src/modules/user/infrastructure/database/mongoose/schemas/user.schema';
import { CompanyMembershipRoleEnum } from '@src/modules/company/domain/enums/company-membership-role.enum';
import { CompanyMembershipStatusEnum } from '@src/modules/company/domain/enums/company-membership-status.enum';
import { CompanyStatusEnum } from '@src/modules/company/domain/enums/company-status.enum';

function queryMock<T>(value: T) {
  return {
    sort: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(value),
  };
}

describe('CompanyMembershipService', () => {
  let service: CompanyMembershipService;
  let membershipModel: {
    find: jest.Mock;
    findOne: jest.Mock;
    findOneAndUpdate: jest.Mock;
  };
  let companyModel: {
    find: jest.Mock;
    findOne: jest.Mock;
    findById: jest.Mock;
  };
  let userModel: {
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };

  const activeMembership = {
    _id: { toString: () => 'membership-1' },
    userId: 'user-1',
    companyId: 'company-1',
    role: CompanyMembershipRoleEnum.OWNER,
    status: CompanyMembershipStatusEnum.ACTIVE,
    createdAt: new Date('2026-05-20T10:00:00.000Z'),
    updatedAt: new Date('2026-05-20T10:00:00.000Z'),
  };

  const company = {
    _id: { toString: () => 'company-1' },
    slug: 'fitness-company',
    tradeName: 'Fitness Company',
    contacts: {
      email: 'company@example.com',
      phone: {},
      address: {},
    },
    documents: {},
    media: {},
    status: CompanyStatusEnum.ACTIVE,
  };

  beforeEach(() => {
    membershipModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };
    companyModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
    };
    userModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn().mockReturnValue(queryMock(null)),
    };

    service = new CompanyMembershipService(
      membershipModel as unknown as Model<CompanyMembershipDocument>,
      companyModel as unknown as Model<CompanySchema>,
      userModel as unknown as Model<UserSchema>,
    );
  });

  it('returns active companies for the user memberships', async () => {
    membershipModel.find.mockReturnValue(queryMock([activeMembership]));
    companyModel.find.mockReturnValue(queryMock([company]));

    const result = await service.getUserCompanies('user-1');

    expect(result).toEqual([
      expect.objectContaining({
        _id: 'company-1',
        tradeName: 'Fitness Company',
      }),
    ]);
    expect(membershipModel.find).toHaveBeenCalledWith({
      userId: 'user-1',
      status: CompanyMembershipStatusEnum.ACTIVE,
    });
    expect(companyModel.find).toHaveBeenCalledWith({
      _id: { $in: ['company-1'] },
    });
  });

  it('resolves requested active company only when membership exists', async () => {
    membershipModel.findOne.mockReturnValue(queryMock(activeMembership));

    const result = await service.getUserActiveCompanyId('user-1', 'company-1');

    expect(result).toBe('company-1');
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('user-1', {
      $set: { 'recruiterProfile.companyId': 'company-1' },
    });
  });

  it('backfills owner membership from a legacy createdBy company', async () => {
    userModel.findById.mockReturnValue(queryMock({ recruiterProfile: {} }));
    membershipModel.findOne
      .mockReturnValueOnce(queryMock(null))
      .mockReturnValueOnce(queryMock(null));
    companyModel.findOne.mockReturnValue(queryMock(company));
    membershipModel.findOneAndUpdate.mockReturnValue(
      queryMock(activeMembership),
    );

    const result = await service.getUserActiveCompanyId('user-1');

    expect(result).toBe('company-1');
    expect(membershipModel.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: 'user-1', companyId: 'company-1' },
      {
        $setOnInsert: {
          userId: 'user-1',
          companyId: 'company-1',
          role: CompanyMembershipRoleEnum.OWNER,
          status: CompanyMembershipStatusEnum.ACTIVE,
          invitedBy: undefined,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );
  });

  it('checks active access and roles', async () => {
    membershipModel.findOne.mockReturnValue(queryMock(activeMembership));

    await expect(
      service.userHasCompanyAccess('user-1', 'company-1'),
    ).resolves.toBe(true);
    await expect(
      service.userHasCompanyRole('user-1', 'company-1', [
        CompanyMembershipRoleEnum.ADMIN,
        CompanyMembershipRoleEnum.OWNER,
      ]),
    ).resolves.toBe(true);
    await expect(
      service.userHasCompanyRole(
        'user-1',
        'company-1',
        CompanyMembershipRoleEnum.VIEWER,
      ),
    ).resolves.toBe(false);
  });

  it('returns false when there is no active membership', async () => {
    membershipModel.findOne.mockReturnValue(queryMock(null));

    await expect(
      service.userHasCompanyAccess('user-1', 'company-1'),
    ).resolves.toBe(false);
  });
});
