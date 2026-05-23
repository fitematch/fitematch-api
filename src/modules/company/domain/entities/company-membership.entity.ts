import { CompanyMembershipRoleEnum } from '@src/modules/company/domain/enums/company-membership-role.enum';
import { CompanyMembershipStatusEnum } from '@src/modules/company/domain/enums/company-membership-status.enum';

export interface CompanyMembershipEntity {
  _id: string;
  userId: string;
  companyId: string;
  role: CompanyMembershipRoleEnum;
  status: CompanyMembershipStatusEnum;
  invitedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
