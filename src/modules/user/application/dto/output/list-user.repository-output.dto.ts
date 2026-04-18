import {
  CandidateProfileEntity,
  RecruiterProfileEntity,
} from '@src/modules/user/domain/entities/user.entity';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export class ListUserRepositoryOutputDto {
  id?: string;
  name?: string;
  email?: string;
  birthday?: string;
  candidateProfile?: CandidateProfileEntity;
  recruiterProfile?: RecruiterProfileEntity;
  adminRole?: AdminRoleEnum;
  productRole?: ProductRoleEnum;
  status?: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
