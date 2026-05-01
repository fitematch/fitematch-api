import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { UPDATE_APPLY_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { UpdateApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/update-apply.use-case.interface';
import { UpdateApplyRequestDto } from '@src/modules/apply/adapters/http/dto/request/update-apply-request.dto';
import { UpdateApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/update-apply-response.dto';
import { UpdateApplyMapper } from '@src/modules/apply/adapters/http/mappers/update-apply.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Apply')
@Controller('apply')
export class UpdateApplyController {
  constructor(
    @Inject(UPDATE_APPLY_USE_CASE)
    private readonly updateApplyUseCase: UpdateApplyUseCaseInterface,
  ) {}

  @Patch(':applyId')
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update apply status' })
  @ApiParam({ name: 'applyId', type: String })
  @ApiOkResponse({ type: UpdateApplyResponseDto })
  async handle(
    @Param('applyId') applyId: string,
    @Body() body: UpdateApplyRequestDto,
    @CurrentUser() user: AuthUserPayload,
  ): Promise<UpdateApplyResponseDto> {
    const output = await this.updateApplyUseCase.execute({
      _id: applyId,
      status: body.status,
      productRole: user.productRole,
      recruiterCompanyId: user.recruiterProfile?.companyId,
    });

    return UpdateApplyMapper.toResponse(output);
  }
}
