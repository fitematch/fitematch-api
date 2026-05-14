import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_ROLES_KEY } from '@src/modules/auth/adapters/http/decorators/admin-roles.decorator';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

interface AuthenticatedRequestUser {
  id?: string;
  userId?: string;
  sub?: string;
  email?: string;
  adminRole?: AdminRoleEnum;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedRequestUser;
}

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRoleEnum[]>(
      ADMIN_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user?.adminRole) {
      throw new ForbiddenException('User admin role was not found in token.');
    }

    const hasRole = requiredRoles.includes(user.adminRole);

    if (!hasRole) {
      throw new ForbiddenException(
        'You are not allowed to access this resource.',
      );
    }

    return true;
  }
}
