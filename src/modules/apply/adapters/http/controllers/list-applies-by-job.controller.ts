import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { LIST_APPLIES_BY_JOB_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ListAppliesByJobUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/list-applies-by-job.use-case.interface';
import { ListAppliesByJobResponseDto } from '@src/modules/apply/adapters/http/dto/response/list-applies-by-job-response.dto';
import { ListAppliesByJobMapper } from '@src/modules/apply/adapters/http/mappers/list-applies-by-job.mapper';

import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';

@ApiTags('Apply')
@Controller('apply')
export class ListAppliesByJobController {
  constructor(
    @Inject(LIST_APPLIES_BY_JOB_USE_CASE)
    private readonly listAppliesByJobUseCase: ListAppliesByJobUseCaseInterface,
  ) {}

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List applies by job' })
  @ApiParam({ name: 'jobId', type: String })
  @ApiOkResponse({ type: ListAppliesByJobResponseDto, isArray: true })
  async handle(
    @Param('jobId') jobId: string,
  ): Promise<ListAppliesByJobResponseDto[]> {
    const output = await this.listAppliesByJobUseCase.execute({
      jobId,
    });

    return ListAppliesByJobMapper.toResponseList(output);
  }
}
