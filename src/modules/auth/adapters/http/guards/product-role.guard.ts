import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PRODUCT_ROLES_KEY } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

interface AuthenticatedRequestUser {
  id?: string;
  userId?: string;
  sub?: string;
  email?: string;
  productRole?: ProductRoleEnum;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedRequestUser;
}

@Injectable()
export class ProductRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ProductRoleEnum[]>(
      PRODUCT_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user?.productRole) {
      throw new ForbiddenException('User role was not found in token.');
    }

    const hasRole = requiredRoles.includes(user.productRole);

    if (!hasRole) {
      throw new ForbiddenException(
        'You are not allowed to access this resource.',
      );
    }

    return true;
  }
}
