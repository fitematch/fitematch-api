import {
  CandidateProfileEntity,
  RecruiterProfileEntity,
} from '@src/modules/user/domain/entities/user.entity';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export type LeanUser = {
  _id: { toString(): string };
  name: string;
  email: string;
  password: string;
  birthday: Date;
  candidateProfile?: CandidateProfileEntity;
  recruiterProfile?: RecruiterProfileEntity;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  status: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
};
