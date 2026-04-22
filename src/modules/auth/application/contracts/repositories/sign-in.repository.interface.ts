import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

export interface SignInUserData {
  id: string;
  name: string;
  email: string;
  password: string;
  status?: string;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  permissions?: PermissionEnum[];
}

export interface SignInRepositoryInterface {
  findByEmail(email: string): Promise<SignInUserData | null>;
}
