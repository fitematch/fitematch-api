import {
  Controller,
  Get,
  Inject,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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

interface AuthenticatedUserPayload {
  id?: string;
  sub?: string;
  userId?: string;
}

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
    @CurrentUser() user: AuthenticatedUserPayload,
  ): Promise<ListAuthSessionsResponseDto[]> {
    const userId = user.id ?? user.sub ?? user.userId;

    if (!userId) {
      throw new UnauthorizedException('Authenticated user id not found.');
    }

    const output = await this.useCase.execute({
      userId,
    });

    return ListAuthSessionsMapper.toResponseList(output);
  }
}
