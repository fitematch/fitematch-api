import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { UPDATE_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { UpdateJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/update-job.use-case.interface';
import { UpdateJobRequestDto } from '@src/modules/job/adapters/http/dto/request/update-job-request.dto';
import { UpdateJobResponseDto } from '@src/modules/job/adapters/http/dto/response/update-job.response.dto';
import { UpdateJobMapper } from '@src/modules/job/adapters/http/mappers/update-job.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Job')
@Controller('job')
export class UpdateJobController {
  constructor(
    @Inject(UPDATE_JOB_USE_CASE)
    private readonly updateJobUseCase: UpdateJobUseCaseInterface,
  ) {}

  @Patch(':jobId')
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update job' })
  @ApiParam({ name: 'jobId', type: String })
  @ApiOkResponse({ type: UpdateJobResponseDto })
  async handle(
    @Param('jobId') jobId: string,
    @Body() body: UpdateJobRequestDto,
    @CurrentUser() user: AuthUserPayload,
  ): Promise<UpdateJobResponseDto> {
    const output = await this.updateJobUseCase.execute({
      _id: jobId,
      ...body,
      productRole: user.productRole,
      recruiterCompanyId: user.recruiterProfile?.companyId,
    });

    return UpdateJobMapper.toResponse(output);
  }
}
