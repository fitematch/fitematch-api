import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LIST_APPLY_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ListApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/list-apply.use-case.interface';
import { ListApplyQueryDto } from '@src/modules/apply/adapters/http/dto/request/list-apply.query.dto';
import { ListApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/list-apply.response.dto';
import { ListApplyMapper } from '@src/modules/apply/adapters/http/mappers/list-apply.mapper';

@ApiTags('Apply')
@ApiBearerAuth('JWT')
@Controller('apply')
export class ListApplyController {
  constructor(
    @Inject(LIST_APPLY_USE_CASE)
    private readonly listApplyUseCase: ListApplyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'List job applications',
    description: 'Returns the list of job applications.',
  })
  @ApiOkResponse({
    description: 'Job applications listed successfully.',
    type: ListApplyResponseDto,
    isArray: true,
  })
  @Get()
  async handle(
    @Query() query: ListApplyQueryDto,
  ): Promise<ListApplyResponseDto[]> {
    const result = await this.listApplyUseCase.execute({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      jobId: query.jobId,
      userId: query.userId,
      status: query.status,
    });

    return result.map((apply) => ListApplyMapper.toResponse(apply));
  }
}
