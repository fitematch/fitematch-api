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
import type { ReadJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/read-job.use-case.interface';
import { READ_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import { ReadJobParamsDto } from '@src/modules/job/adapters/http/dto/request/read-job.params.dto';
import { ReadJobResponseDto } from '@src/modules/job/adapters/http/dto/response/read-job.response.dto';
import { ReadJobMapper } from '@src/modules/job/adapters/http/mappers/read-job.mapper';
import { ReadJobRequestMapper } from '@src/modules/job/adapters/http/mappers/read-job-request.mapper';

@ApiTags('Job')
@ApiBearerAuth('JWT')
@Controller('job')
export class ReadJobController {
  constructor(
    @Inject(READ_JOB_USE_CASE)
    private readonly readJobUseCase: ReadJobUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Return one job position',
    description: 'Returns one job position by ID.',
  })
  @ApiOkResponse({
    description: 'Job position returned successfully.',
    type: ReadJobResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Job not found!',
  })
  @Get(':_id')
  async handle(@Param() params: ReadJobParamsDto): Promise<ReadJobResponseDto> {
    const result = await this.readJobUseCase.execute(
      ReadJobRequestMapper.toInput(params),
    );

    if (!result) {
      throw new NotFoundException('Job not found!');
    }

    return ReadJobMapper.toResponse(result);
  }
}
