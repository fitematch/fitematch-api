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
import type { ReadCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/read-company.use-case.interface';
import { READ_COMPANY_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import { ReadCompanyParamsDto } from '@src/modules/company/adapters/http/dto/request/read-company.params.dto';
import { ReadCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/read-company.response.dto';
import { ReadCompanyMapper } from '@src/modules/company/adapters/http/mappers/read-company.mapper';
import { ReadCompanyRequestMapper } from '@src/modules/company/adapters/http/mappers/read-company-request.mapper';

@ApiTags('Company')
@ApiBearerAuth('JWT')
@Controller('company')
export class ReadCompanyController {
  constructor(
    @Inject(READ_COMPANY_USE_CASE)
    private readonly readCompanyUseCase: ReadCompanyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Return one company',
    description: 'Returns one company by ID.',
  })
  @ApiOkResponse({
    description: 'Company returned successfully.',
    type: ReadCompanyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Company not found!',
  })
  @Get(':_id')
  async handle(
    @Param() params: ReadCompanyParamsDto,
  ): Promise<ReadCompanyResponseDto> {
    const result = await this.readCompanyUseCase.execute(
      ReadCompanyRequestMapper.toInput(params),
    );

    if (!result) {
      throw new NotFoundException('Company not found!');
    }

    return ReadCompanyMapper.toResponse(result);
  }
}
