import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { DeleteCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/delete-company.use-case.interface';
import { DELETE_COMPANY_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import { DeleteCompanyParamsDto } from '@src/modules/company/adapters/http/dto/request/delete-company.params.dto';
import { DeleteCompanyRequestMapper } from '@src/modules/company/adapters/http/mappers/delete-company-request.mapper';

@ApiTags('Company')
@ApiBearerAuth('JWT')
@Controller('company')
export class DeleteCompanyController {
  constructor(
    @Inject(DELETE_COMPANY_USE_CASE)
    private readonly deleteCompanyUseCase: DeleteCompanyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Delete company',
    description: 'Deletes a company by id.',
  })
  @ApiNoContentResponse({
    description: 'Company deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Company not found.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param() params: DeleteCompanyParamsDto): Promise<void> {
    const deleted = await this.deleteCompanyUseCase.execute(
      DeleteCompanyRequestMapper.toInput(params),
    );

    if (!deleted) {
      throw new NotFoundException('Company not found.');
    }
  }
}
