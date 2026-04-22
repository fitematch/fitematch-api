import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayloadType } from '@src/modules/auth/domain/types/jwt-payload.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayloadType => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayloadType }>();

    return request.user;
  },
);
