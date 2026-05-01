import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CREATE_APPLY_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { CreateApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/create-apply.use-case.interface';
import type { CreateApplyRequestDto } from '@src/modules/apply/adapters/http/dto/request/create-apply.request.dto';
import { CreateApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/create-apply.response.dto';
import { CreateApplyMapper } from '@src/modules/apply/adapters/http/mappers/create-apply.mapper';
import { CreateApplyRequestMapper } from '@src/modules/apply/adapters/http/mappers/create-apply-request.mapper';

import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Apply')
@Controller('apply')
export class CreateApplyController {
  constructor(
    @Inject(CREATE_APPLY_USE_CASE)
    private readonly createApplyUseCase: CreateApplyUseCaseInterface,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.CANDIDATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create apply' })
  @ApiCreatedResponse({ type: CreateApplyResponseDto })
  async handle(
    @Body() body: CreateApplyRequestDto,
    @CurrentUser() user: AuthUserPayload,
  ): Promise<CreateApplyResponseDto> {
    const output = await this.createApplyUseCase.execute({
      ...CreateApplyRequestMapper.toInput(body),
      userId: user.id,
    });

    return CreateApplyMapper.toResponse(output);
  }
}
