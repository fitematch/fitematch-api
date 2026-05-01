import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { READ_APPLY_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ReadApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/read-apply.use-case.interface';
import { ReadApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/read-apply-response.dto';
import { ReadApplyMapper } from '@src/modules/apply/adapters/http/mappers/read-apply.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

@ApiTags('Apply')
@Controller('apply')
export class ReadApplyController {
  constructor(
    @Inject(READ_APPLY_USE_CASE)
    private readonly readApplyUseCase: ReadApplyUseCaseInterface,
  ) {}

  @Get(':applyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Read apply' })
  @ApiParam({ name: 'applyId', type: String })
  @ApiOkResponse({ type: ReadApplyResponseDto })
  async handle(
    @Param('applyId') applyId: string,
    @CurrentUser() user: AuthUserPayload,
  ): Promise<ReadApplyResponseDto> {
    const output = await this.readApplyUseCase.execute({
      _id: applyId,
      userId: user.id,
      productRole: user.productRole,
      recruiterCompanyId: user.recruiterProfile?.companyId,
    });

    return ReadApplyMapper.toResponse(output);
  }
}
