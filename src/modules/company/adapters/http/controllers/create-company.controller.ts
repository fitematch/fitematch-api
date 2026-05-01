import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CREATE_COMPANY_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { CreateCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/create-company.use-case.interface';
import type { CreateCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/create-company.request.dto';
import { CreateCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/create-company.response.dto';
import { CreateCompanyMapper } from '@src/modules/company/adapters/http/mappers/create-company.mapper';
import { CreateCompanyRequestMapper } from '@src/modules/company/adapters/http/mappers/create-company-request.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Company')
@Controller('company')
export class CreateCompanyController {
  constructor(
    @Inject(CREATE_COMPANY_USE_CASE)
    private readonly createCompanyUseCase: CreateCompanyUseCaseInterface,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create company' })
  @ApiCreatedResponse({ type: CreateCompanyResponseDto })
  async handle(
    @Body() body: CreateCompanyRequestDto,
  ): Promise<CreateCompanyResponseDto> {
    const output = await this.createCompanyUseCase.execute(
      CreateCompanyRequestMapper.toInput(body),
    );

    return CreateCompanyMapper.toResponse(output);
  }
}
