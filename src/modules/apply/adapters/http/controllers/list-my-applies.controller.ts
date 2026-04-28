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

import { LIST_MY_APPLIES_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ListMyAppliesUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/list-my-applies.use-case.interface';
import { ListMyAppliesResponseDto } from '@src/modules/apply/adapters/http/dto/response/list-my-applies-response.dto';
import { ListMyAppliesMapper } from '@src/modules/apply/adapters/http/mappers/list-my-applies.mapper';

import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';

interface AuthenticatedUserPayload {
  id?: string;
  sub?: string;
  userId?: string;
}

@ApiTags('Apply')
@Controller('apply')
export class ListMyAppliesController {
  constructor(
    @Inject(LIST_MY_APPLIES_USE_CASE)
    private readonly listMyAppliesUseCase: ListMyAppliesUseCaseInterface,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List authenticated user applies' })
  @ApiOkResponse({ type: ListMyAppliesResponseDto, isArray: true })
  async handle(
    @CurrentUser() user: AuthenticatedUserPayload,
  ): Promise<ListMyAppliesResponseDto[]> {
    const userId = user.id ?? user.sub ?? user.userId;

    if (!userId) {
      throw new UnauthorizedException('Authenticated user id not found.');
    }

    const output = await this.listMyAppliesUseCase.execute({
      userId,
    });

    return ListMyAppliesMapper.toResponseList(output);
  }
}
