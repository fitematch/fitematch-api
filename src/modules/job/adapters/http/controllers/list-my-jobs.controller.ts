import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { LIST_MY_JOBS_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { ListMyJobsUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/list-my-jobs.use-case.interface';
import { ListMyJobsResponseDto } from '@src/modules/job/adapters/http/dto/response/list-my-jobs-response.dto';
import { ListMyJobsMapper } from '@src/modules/job/adapters/http/mappers/list-my-jobs.mapper';
import { JwtAuthGuard } from '@src/modules/auth/adapters/http/guards/jwt-auth.guard';
import { CurrentUser } from '@src/modules/auth/adapters/http/decorators/current-user.decorator';

interface AuthenticatedUserPayload {
  id: string;
  sub?: string;
  userId?: string;
  recruiterProfile?: {
    companyId?: string;
  };
}

@ApiTags('Job')
@Controller('job')
export class ListMyJobsController {
  constructor(
    @Inject(LIST_MY_JOBS_USE_CASE)
    private readonly listMyJobsUseCase: ListMyJobsUseCaseInterface,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List authenticated recruiter jobs' })
  @ApiOkResponse({
    type: ListMyJobsResponseDto,
    isArray: true,
  })
  async handle(
    @CurrentUser() user: AuthenticatedUserPayload,
  ): Promise<ListMyJobsResponseDto[]> {
    const output = await this.listMyJobsUseCase.execute({
      companyId: user.recruiterProfile?.companyId,
    });

    return ListMyJobsMapper.toResponseList(output);
  }
}
