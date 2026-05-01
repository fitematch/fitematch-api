import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { AdminRoleEnum } from '@src/modules/user/domain/enums/admin-role.enum';

interface JwtPayload {
  sub?: string;
  id?: string;
  email: string;
  productRole: ProductRoleEnum;
  adminRole?: AdminRoleEnum;
  recruiterProfile?: {
    companyId?: string;
    position?: string;
  };
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return secret;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: getJwtSecret(),
    });
  }

  validate(payload: JwtPayload): AuthUserPayload {
    const userId = payload.id ?? payload.sub;

    if (!userId) {
      throw new UnauthorizedException('Authenticated user id not found.');
    }

    return {
      id: userId,
      email: payload.email,
      productRole: payload.productRole,
      adminRole: payload.adminRole,
      recruiterProfile: payload.recruiterProfile,
    };
  }
}
