import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { READ_MY_COMPANY_USE_CASE } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { ReadMyCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/read-my-company.use-case.interface';
import { ReadMyCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/read-my-company.response.dto';
import { ReadMyCompanyMapper } from '@src/modules/company/adapters/http/mappers/read-my-company.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

@ApiTags('Company')
@ApiBearerAuth('JWT')
@Controller('company')
export class ReadMyCompanyController {
  constructor(
    @Inject(READ_MY_COMPANY_USE_CASE)
    private readonly readMyCompanyUseCase: ReadMyCompanyUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Get authenticated recruiter company',
  })
  @ApiOkResponse({
    description: 'Authenticated recruiter company returned successfully.',
    type: ReadMyCompanyResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Authenticated recruiter company not found!',
  })
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @Get('me')
  async handle(
    @CurrentUser() user: AuthUserPayload,
  ): Promise<ReadMyCompanyResponseDto> {
    const result = await this.readMyCompanyUseCase.execute({
      userId: user.id,
    });

    if (!result) {
      throw new NotFoundException('Company not found!');
    }

    return ReadMyCompanyMapper.toResponse(result);
  }
}
