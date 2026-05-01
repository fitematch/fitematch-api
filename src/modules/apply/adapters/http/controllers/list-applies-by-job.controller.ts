import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { LIST_APPLIES_BY_JOB_USE_CASE } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ListAppliesByJobUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/list-applies-by-job.use-case.interface';
import { ListAppliesByJobResponseDto } from '@src/modules/apply/adapters/http/dto/response/list-applies-by-job-response.dto';
import { ListAppliesByJobMapper } from '@src/modules/apply/adapters/http/mappers/list-applies-by-job.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Apply')
@Controller('apply')
export class ListAppliesByJobController {
  constructor(
    @Inject(LIST_APPLIES_BY_JOB_USE_CASE)
    private readonly listAppliesByJobUseCase: ListAppliesByJobUseCaseInterface,
  ) {}

  @Get('job/:jobId')
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List applies by job' })
  @ApiParam({ name: 'jobId', type: String })
  @ApiOkResponse({ type: ListAppliesByJobResponseDto, isArray: true })
  async handle(
    @Param('jobId') jobId: string,
    @CurrentUser() user: AuthUserPayload,
  ): Promise<ListAppliesByJobResponseDto[]> {
    const output = await this.listAppliesByJobUseCase.execute({
      jobId,
      recruiterCompanyId: user.recruiterProfile?.companyId,
    });

    return ListAppliesByJobMapper.toResponseList(output);
  }
}
