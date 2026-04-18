import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { ListJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/list-job.use-case.interface';
import { LIST_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import { ListJobQueryDto } from '@src/modules/job/adapters/http/dto/request/list-job.query.dto';
import { ListJobResponseDto } from '@src/modules/job/adapters/http/dto/response/list-job.response.dto';
import { ListJobMapper } from '@src/modules/job/adapters/http/mappers/list-job.mapper';

@ApiTags('Job')
@ApiBearerAuth('JWT')
@Controller('job')
export class ListJobController {
  constructor(
    @Inject(LIST_JOB_USE_CASE)
    private readonly listJobUseCase: ListJobUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'List jobs',
    description: 'Returns the list of jobs.',
  })
  @ApiOkResponse({
    description: 'Jobs listed successfully.',
    type: ListJobResponseDto,
    isArray: true,
  })
  @Get()
  async handle(@Query() query: ListJobQueryDto): Promise<ListJobResponseDto[]> {
    const result = await this.listJobUseCase.execute({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
      status: query.status,
      companyId: query.companyId,
    });

    return result.map((job) => ListJobMapper.toResponse(job));
  }
}
