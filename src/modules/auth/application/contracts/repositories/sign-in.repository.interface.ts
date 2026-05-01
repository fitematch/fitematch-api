import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import type { RecruiterProfileEntity } from '@src/modules/user/domain/entities/user.entity';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

export interface SignInUserData {
  id: string;
  name: string;
  email: string;
  password: string;
  status?: string;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  recruiterProfile?: RecruiterProfileEntity;
  permissions?: PermissionEnum[];
}

export interface SignInRepositoryInterface {
  findByEmail(email: string): Promise<SignInUserData | null>;
}
