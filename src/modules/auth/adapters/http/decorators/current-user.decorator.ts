import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

type CurrentUserDecorator = () => ParameterDecorator;

export const CurrentUser: CurrentUserDecorator = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserPayload => {
    const request = ctx.switchToHttp().getRequest<{ user?: AuthUserPayload }>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authenticated user not found.');
    }

    return user;
  },
);
