import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
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
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Apply')
@Controller('apply')
export class ListMyAppliesController {
  constructor(
    @Inject(LIST_MY_APPLIES_USE_CASE)
    private readonly listMyAppliesUseCase: ListMyAppliesUseCaseInterface,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.CANDIDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List authenticated candidate applies' })
  @ApiOkResponse({ type: ListMyAppliesResponseDto, isArray: true })
  async handle(
    @CurrentUser() user: AuthUserPayload,
  ): Promise<ListMyAppliesResponseDto[]> {
    const output = await this.listMyAppliesUseCase.execute({
      userId: user.id,
    });

    return ListMyAppliesMapper.toResponseList(output);
  }
}
