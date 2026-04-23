import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UPDATE_APPLY_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { UpdateApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/update-apply.use-case.interface';
import { UpdateApplyParamsDto } from '@src/modules/apply/adapters/http/dto/request/update-apply.params.dto';
import { UpdateApplyRequestDto } from '@src/modules/apply/adapters/http/dto/request/update-apply.request.dto';
import { UpdateApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/update-apply.response.dto';
import { UpdateApplyRequestMapper } from '@src/modules/apply/adapters/http/mappers/update-apply-request.mapper';
import { UpdateApplyMapper } from '@src/modules/apply/adapters/http/mappers/update-apply.mapper';

@ApiTags('Apply')
@ApiBearerAuth('JWT')
@Controller('apply')
export class UpdateApplyController {
  constructor(
    @Inject(UPDATE_APPLY_USE_CASE)
    private readonly updateApplyUseCase: UpdateApplyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Update one job application',
    description: 'Updates one job application by ID.',
  })
  @ApiOkResponse({
    description: 'Job application updated successfully.',
    type: UpdateApplyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Job application not found!',
  })
  @Patch(':applyId')
  async handle(
    @Param() params: UpdateApplyParamsDto,
    @Body() body: UpdateApplyRequestDto,
  ): Promise<UpdateApplyResponseDto> {
    const result = await this.updateApplyUseCase.execute(
      UpdateApplyRequestMapper.toInput(params, body),
    );

    if (!result) {
      throw new NotFoundException('Job application not found!');
    }

    return UpdateApplyMapper.toResponse(result);
  }
}
