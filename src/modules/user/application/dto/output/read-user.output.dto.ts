import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import {
  CandidateProfileEntity,
  RecruiterProfileEntity,
} from '@src/modules/user/domain/entities/user.entity';

export class ReadUserOutputDto {
  _id!: string;
  name!: string;
  email!: string;
  birthday?: string;
  candidateProfile?: CandidateProfileEntity;
  recruiterProfile?: RecruiterProfileEntity;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  status!: UserStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
