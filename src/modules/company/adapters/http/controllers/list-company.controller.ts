import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { ListCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/list-company.use-case.interface';
import { LIST_COMPANY_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import { ListCompanyQueryDto } from '@src/modules/company/adapters/http/dto/request/list-company.query.dto';
import { ListCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/list-company.response.dto';
import { ListCompanyMapper } from '@src/modules/company/adapters/http/mappers/list-company.mapper';

@ApiTags('Company')
@ApiBearerAuth('JWT')
@Controller('company')
export class ListCompanyController {
  constructor(
    @Inject(LIST_COMPANY_USE_CASE)
    private readonly listCompanyUseCase: ListCompanyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'List all companies',
    description: 'Returns the list of all companies.',
  })
  @ApiOkResponse({
    description: 'Companies listed successfully.',
    type: ListCompanyResponseDto,
    isArray: true,
  })
  @Get()
  async handle(
    @Query() query: ListCompanyQueryDto,
  ): Promise<ListCompanyResponseDto[]> {
    const result = await this.listCompanyUseCase.execute({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
      status: query.status,
    });

    return result.map((company) => ListCompanyMapper.toResponse(company));
  }
}
