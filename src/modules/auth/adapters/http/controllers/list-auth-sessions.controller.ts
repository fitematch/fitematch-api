import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { LIST_AUTH_SESSIONS_USE_CASE } from '@src/modules/auth/application/contracts/tokens/auth.tokens';
import type { ListAuthSessionsUseCaseInterface } from '@src/modules/auth/application/contracts/use-cases/list-auth-sessions.use-case.interface';
import { ListAuthSessionsResponseDto } from '@src/modules/auth/adapters/http/dto/response/list-auth-sessions-response.dto';
import { ListAuthSessionsMapper } from '@src/modules/auth/adapters/http/mappers/list-auth-sessions.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

@ApiTags('Auth')
@Controller('auth')
export class ListAuthSessionsController {
  constructor(
    @Inject(LIST_AUTH_SESSIONS_USE_CASE)
    private readonly useCase: ListAuthSessionsUseCaseInterface,
  ) {}

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List authenticated user sessions' })
  @ApiOkResponse({
    type: ListAuthSessionsResponseDto,
    isArray: true,
  })
  async handle(
    @CurrentUser() user: AuthUserPayload,
  ): Promise<ListAuthSessionsResponseDto[]> {
    const output = await this.useCase.execute({
      userId: user.id,
    });

    return ListAuthSessionsMapper.toResponseList(output);
  }
}
