import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export class SignInResponseDto {
  accessToken!: string;
  user!: {
    id: string;
    name: string;
    email: string;
    productRole?: ProductRoleEnum;
    adminRole?: AdminRoleEnum;
    permissions?: string[];
    status?: string;
  };
}
