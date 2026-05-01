import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CREATE_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { CreateJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/create-job.use-case.interface';
import type { CreateJobRequestDto } from '@src/modules/job/adapters/http/dto/request/create-job.request.dto';
import { CreateJobResponseDto } from '@src/modules/job/adapters/http/dto/response/create-job.response.dto';
import { CreateJobMapper } from '@src/modules/job/adapters/http/mappers/create-job.mapper';
import { CreateJobRequestMapper } from '@src/modules/job/adapters/http/mappers/create-job-request.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { ProductRoleGuard } from '@src/modules/auth/adapters/http/guards/product-role.guard';
import { ProductRoles } from '@src/modules/auth/adapters/http/decorators/product-roles.decorator';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@ApiTags('Job')
@Controller('job')
export class CreateJobController {
  constructor(
    @Inject(CREATE_JOB_USE_CASE)
    private readonly createJobUseCase: CreateJobUseCaseInterface,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, ProductRoleGuard)
  @ProductRoles(ProductRoleEnum.RECRUITER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create job' })
  @ApiCreatedResponse({ type: CreateJobResponseDto })
  async handle(
    @Body() body: CreateJobRequestDto,
  ): Promise<CreateJobResponseDto> {
    const output = await this.createJobUseCase.execute(
      CreateJobRequestMapper.toInput(body),
    );

    return CreateJobMapper.toResponse(output);
  }
}
