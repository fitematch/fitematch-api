import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CREATE_MY_COMPANY_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { CreateMyCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/create-my-company.use-case.interface';
import type { CreateMyCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/create-my-company.request.dto';
import { CreateMyCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/create-my-company.response.dto';
import { CreateMyCompanyRequestMapper } from '@src/modules/company/adapters/http/mappers/create-my-company-request.mapper';
import { CreateMyCompanyMapper } from '@src/modules/company/adapters/http/mappers/create-my-company.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

@ApiTags('Company')
@ApiBearerAuth('JWT')
@Controller('company')
export class CreateMyCompanyController {
  constructor(
    @Inject(CREATE_MY_COMPANY_USE_CASE)
    private readonly createMyCompanyUseCase: CreateMyCompanyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Create authenticated recruiter company',
  })
  @ApiCreatedResponse({
    description: 'Authenticated recruiter company created successfully.',
    type: CreateMyCompanyResponseDto,
  })
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @Post('me')
  async handle(
    @CurrentUser() user: AuthUserPayload,
    @Body() body: CreateMyCompanyRequestDto,
  ): Promise<CreateMyCompanyResponseDto> {
    const result = await this.createMyCompanyUseCase.execute(
      CreateMyCompanyRequestMapper.toInput(user, body),
    );

    return CreateMyCompanyMapper.toResponse(result);
  }
}
