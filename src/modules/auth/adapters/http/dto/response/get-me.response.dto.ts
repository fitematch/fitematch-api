import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

export class GetMeResponseDto {
  id!: string;
  name!: string;
  email!: string;
  birthday?: string;
  productRole?: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  permissions?: PermissionEnum[];
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
