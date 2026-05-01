import {
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { REVOKE_AUTH_SESSION_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { RevokeAuthSessionUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/revoke-auth-session.use-case.interface';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

@ApiTags('Auth')
@Controller('auth')
export class RevokeAuthSessionController {
  constructor(
    @Inject(REVOKE_AUTH_SESSION_USE_CASE)
    private readonly useCase: RevokeAuthSessionUseCaseInterface,
  ) {}

  @Patch('sessions/:sessionId/revoke')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke authenticated user session' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiNoContentResponse()
  async handle(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthUserPayload,
  ): Promise<void> {
    await this.useCase.execute({
      sessionId,
      userId: user.id,
    });
  }
}
