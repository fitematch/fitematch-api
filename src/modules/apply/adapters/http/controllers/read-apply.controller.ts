import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { READ_APPLY_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ReadApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/read-apply.use-case.interface';
import { ReadApplyParamsDto } from '@src/modules/apply/adapters/http/dto/request/read-apply.params.dto';
import { ReadApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/read-apply.response.dto';
import { ReadApplyMapper } from '@src/modules/apply/adapters/http/mappers/read-apply.mapper';
import { ReadApplyRequestMapper } from '@src/modules/apply/adapters/http/mappers/read-apply-request.mapper';

@ApiTags('Apply')
@ApiBearerAuth('JWT')
@Controller('apply')
export class ReadApplyController {
  constructor(
    @Inject(READ_APPLY_USE_CASE)
    private readonly readApplyUseCase: ReadApplyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Read one job application',
    description: 'Returns one job application by ID.',
  })
  @ApiOkResponse({
    description: 'Job application returned successfully.',
    type: ReadApplyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Job application not found!',
  })
  @Get(':applyId')
  async handle(
    @Param() params: ReadApplyParamsDto,
  ): Promise<ReadApplyResponseDto> {
    const result = await this.readApplyUseCase.execute(
      ReadApplyRequestMapper.toInput(params),
    );

    if (!result) {
      throw new NotFoundException('Apply not found!');
    }

    return ReadApplyMapper.toResponse(result);
  }
}
