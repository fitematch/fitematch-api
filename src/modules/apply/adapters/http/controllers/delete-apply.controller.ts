import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { DELETE_APPLY_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { DeleteApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/delete-apply.use-case.interface';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Apply')
@Controller('apply')
export class DeleteApplyController {
  constructor(
    @Inject(DELETE_APPLY_USE_CASE)
    private readonly deleteApplyUseCase: DeleteApplyUseCaseInterface,
  ) {}

  @Delete(':applyId')
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.CANDIDATE)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete apply' })
  @ApiParam({ name: 'applyId', type: String })
  @ApiNoContentResponse()
  async handle(
    @Param('applyId') applyId: string,
    @CurrentUser() user: AuthUserPayload,
  ): Promise<void> {
    await this.deleteApplyUseCase.execute({
      _id: applyId,
      userId: user.id,
      productRole: user.productRole,
    });
  }
}
