import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UPDATE_MY_COMPANY_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { UpdateMyCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/update-my-company.use-case.interface';
import type { UpdateMyCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/update-my-company.request.dto';
import { UpdateMyCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/update-my-company.response.dto';
import { UpdateMyCompanyRequestMapper } from '@src/modules/company/adapters/http/mappers/update-my-company-request.mapper';
import { UpdateMyCompanyMapper } from '@src/modules/company/adapters/http/mappers/update-my-company.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

@ApiTags('Company')
@ApiBearerAuth('JWT')
@Controller('company')
export class UpdateMyCompanyController {
  constructor(
    @Inject(UPDATE_MY_COMPANY_USE_CASE)
    private readonly updateMyCompanyUseCase: UpdateMyCompanyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Update authenticated recruiter company',
  })
  @ApiOkResponse({
    description: 'Authenticated recruiter company updated successfully.',
    type: UpdateMyCompanyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Authenticated recruiter company not found.',
  })
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @Patch('me')
  async handle(
    @CurrentUser() user: AuthUserPayload,
    @Body() body: UpdateMyCompanyRequestDto,
  ): Promise<UpdateMyCompanyResponseDto> {
    const result = await this.updateMyCompanyUseCase.execute(
      UpdateMyCompanyRequestMapper.toInput(user, body),
    );

    if (!result) {
      throw new NotFoundException('Company not found.');
    }

    return UpdateMyCompanyMapper.toResponse(result);
  }
}
