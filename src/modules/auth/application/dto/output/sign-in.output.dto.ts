import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { PermissionEnum } from '@src/shared/domain/enums/permission.enum';

export class SignInOutputDto {
  accessToken!: string;
  user!: {
    id: string;
    name: string;
    email: string;
    productRole?: ProductRoleEnum;
    adminRole?: AdminRoleEnum;
    permissions?: PermissionEnum[];
    status?: string;
  };
}
