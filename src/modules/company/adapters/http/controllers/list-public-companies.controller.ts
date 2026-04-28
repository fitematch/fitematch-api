import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { LIST_PUBLIC_COMPANIES_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { ListPublicCompaniesUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/list-public-companies.use-case.interface';
import { ListPublicCompaniesResponseDto } from '@src/modules/company/adapters/http/dto/response/list-public-companies-response.dto';
import { ListPublicCompaniesMapper } from '@src/modules/company/adapters/http/mappers/list-public-companies.mapper';

@ApiTags('Company')
@Controller('company')
export class ListPublicCompaniesController {
  constructor(
    @Inject(LIST_PUBLIC_COMPANIES_USE_CASE)
    private readonly useCase: ListPublicCompaniesUseCaseInterface,
  ) {}

  @Get('public')
  @ApiOperation({ summary: 'List public companies' })
  @ApiOkResponse({
    type: ListPublicCompaniesResponseDto,
    isArray: true,
  })
  async handle(): Promise<ListPublicCompaniesResponseDto[]> {
    const output = await this.useCase.execute();

    return ListPublicCompaniesMapper.toResponseList(output);
  }
}
