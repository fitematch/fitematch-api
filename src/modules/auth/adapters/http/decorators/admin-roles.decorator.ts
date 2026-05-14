import { SetMetadata } from '@nestjs/common';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

export const ADMIN_ROLES_KEY = 'admin_roles';

export const AdminRoles = (...roles: AdminRoleEnum[]) =>
  SetMetadata(ADMIN_ROLES_KEY, roles);
