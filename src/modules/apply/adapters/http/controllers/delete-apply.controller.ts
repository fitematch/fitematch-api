import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DELETE_APPLY_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { DeleteApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/delete-apply.use-case.interface';
import { DeleteApplyParamsDto } from '@src/modules/apply/adapters/http/dto/request/delete-apply.params.dto';
import { DeleteApplyRequestMapper } from '@src/modules/apply/adapters/http/mappers/delete-apply-request.mapper';

@ApiTags('Apply')
@ApiBearerAuth('JWT')
@Controller('apply')
export class DeleteApplyController {
  constructor(
    @Inject(DELETE_APPLY_USE_CASE)
    private readonly deleteApplyUseCase: DeleteApplyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Delete job application',
    description: 'Deletes one job application by ID.',
  })
  @ApiNoContentResponse({
    description: 'Job application deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Job application not found.',
  })
  @Delete(':_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param() params: DeleteApplyParamsDto): Promise<void> {
    const deleted = await this.deleteApplyUseCase.execute(
      DeleteApplyRequestMapper.toInput(params),
    );

    if (!deleted) {
      throw new NotFoundException('Job application not found!');
    }
  }
}
