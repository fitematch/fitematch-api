import { SetMetadata } from '@nestjs/common';
import type { CustomDecorator } from '@nestjs/common';

import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

export const PRODUCT_ROLES_KEY = 'product-roles';

export const ProductRoles = (
  ...roles: ProductRoleEnum[]
): CustomDecorator<string> => SetMetadata(PRODUCT_ROLES_KEY, roles);
