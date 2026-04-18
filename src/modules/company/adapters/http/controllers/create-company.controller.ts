import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { CreateCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/create-company.use-case.interface';
import { CREATE_COMPANY_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import { CreateCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/create-company.request.dto';
import { CreateCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/create-company.response.dto';
import { CreateCompanyMapper } from '@src/modules/company/adapters/http/mappers/create-company.mapper';
import { CreateCompanyRequestMapper } from '@src/modules/company/adapters/http/mappers/create-company-request.mapper';

@ApiTags('Company')
@ApiBearerAuth('JWT')
@Controller('company')
export class CreateCompanyController {
  constructor(
    @Inject(CREATE_COMPANY_USE_CASE)
    private readonly createCompanyUseCase: CreateCompanyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Create a new company',
    description: 'Creates a new company.',
  })
  @ApiCreatedResponse({
    description: 'Company created successfully.',
    type: CreateCompanyResponseDto,
  })
  @Post()
  async handle(
    @Body() body: CreateCompanyRequestDto,
  ): Promise<CreateCompanyResponseDto> {
    const result = await this.createCompanyUseCase.execute(
      CreateCompanyRequestMapper.toInput(body),
    );

    return CreateCompanyMapper.toResponse(result);
  }
}
