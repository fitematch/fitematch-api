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
import { UPDATE_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { UpdateJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/update-job.use-case.interface';
import { UpdateJobParamsDto } from '@src/modules/job/adapters/http/dto/request/update-job.params.dto';
import { UpdateJobRequestDto } from '@src/modules/job/adapters/http/dto/request/update-job.request.dto';
import { UpdateJobResponseDto } from '@src/modules/job/adapters/http/dto/response/update-job.response.dto';
import { UpdateJobRequestMapper } from '@src/modules/job/adapters/http/mappers/update-job-request.mapper';
import { UpdateJobMapper } from '@src/modules/job/adapters/http/mappers/update-job.mapper';

@ApiTags('Job')
@ApiBearerAuth('JWT')
@Controller('job')
export class UpdateJobController {
  constructor(
    @Inject(UPDATE_JOB_USE_CASE)
    private readonly useCase: UpdateJobUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Update one job position',
    description: 'Updates a job position by ID.',
  })
  @ApiOkResponse({
    description: 'Job position updated successfully.',
    type: UpdateJobResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Job position not found.',
  })
  @Patch(':_id')
  @ApiOkResponse({ type: UpdateJobResponseDto })
  async handle(
    @Param() params: UpdateJobParamsDto,
    @Body() body: UpdateJobRequestDto,
  ): Promise<UpdateJobResponseDto> {
    const result = await this.useCase.execute(
      UpdateJobRequestMapper.toInput(params, body),
    );

    if (!result) {
      throw new NotFoundException('Job not found');
    }

    return UpdateJobMapper.toResponse(result);
  }
}
