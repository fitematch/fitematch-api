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
import type { UpdateCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/update-company.use-case.interface';
import { UPDATE_COMPANY_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import { UpdateCompanyParamsDto } from '@src/modules/company/adapters/http/dto/request/update-company.params.dto';
import { UpdateCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/update-company.request.dto';
import { UpdateCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/update-company.response.dto';
import { UpdateCompanyRequestMapper } from '@src/modules/company/adapters/http/mappers/update-company-request.mapper';
import { UpdateCompanyMapper } from '@src/modules/company/adapters/http/mappers/update-company.mapper';

@ApiTags('Company')
@ApiBearerAuth('JWT')
@Controller('company')
export class UpdateCompanyController {
  constructor(
    @Inject(UPDATE_COMPANY_USE_CASE)
    private readonly updateCompanyUseCase: UpdateCompanyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Update company',
    description: 'Updates a company by id.',
  })
  @ApiOkResponse({
    description: 'Company updated successfully.',
    type: UpdateCompanyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Company not found.',
  })
  @Patch(':id')
  async handle(
    @Param() params: UpdateCompanyParamsDto,
    @Body() body: UpdateCompanyRequestDto,
  ): Promise<UpdateCompanyResponseDto> {
    const result = await this.updateCompanyUseCase.execute(
      UpdateCompanyRequestMapper.toInput(params, body),
    );

    if (!result) {
      throw new NotFoundException('Company not found.');
    }

    return UpdateCompanyMapper.toResponse(result);
  }
}
