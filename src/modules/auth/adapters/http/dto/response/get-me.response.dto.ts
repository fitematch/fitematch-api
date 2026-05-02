import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import {
  CandidateProfileEntity,
  RecruiterContactsEntity,
} from '@src/modules/user/domain/entities/user.entity';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

export class GetMeRecruiterProfileResponseDto {
  companyId?: string;
  tradeName?: string;
  position?: string;
  contacts?: RecruiterContactsEntity;
}

export class GetMeResponseDto {
  id!: string;
  name!: string;
  email!: string;
  birthday?: string;
  candidateProfile?: CandidateProfileEntity;
  recruiterProfile?: GetMeRecruiterProfileResponseDto;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  permissions?: PermissionEnum[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
