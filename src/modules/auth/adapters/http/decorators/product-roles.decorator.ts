import { SetMetadata } from '@nestjs/common';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export const PRODUCT_ROLES_KEY = 'product_roles';

export const ProductRoles = (...roles: ProductRoleEnum[]) =>
  SetMetadata(PRODUCT_ROLES_KEY, roles);
