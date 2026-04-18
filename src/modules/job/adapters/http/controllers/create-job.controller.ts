import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { CreateJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/create-job.use-case.interface';
import { CREATE_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import { CreateJobRequestDto } from '@src/modules/job/adapters/http/dto/request/create-job.request.dto';
import { CreateJobResponseDto } from '@src/modules/job/adapters/http/dto/response/create-job.response.dto';
import { CreateJobMapper } from '@src/modules/job/adapters/http/mappers/create-job.mapper';
import { CreateJobRequestMapper } from '@src/modules/job/adapters/http/mappers/create-job-request.mapper';

@ApiTags('Job')
@ApiBearerAuth('JWT')
@Controller('job')
export class CreateJobController {
  constructor(
    @Inject(CREATE_JOB_USE_CASE)
    private readonly createJobUseCase: CreateJobUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Create a new job',
    description: 'Creates a new job.',
  })
  @ApiCreatedResponse({
    description: 'Job created successfully.',
    type: CreateJobResponseDto,
  })
  @Post()
  async handle(
    @Body() body: CreateJobRequestDto,
  ): Promise<CreateJobResponseDto> {
    const result = await this.createJobUseCase.execute(
      CreateJobRequestMapper.toInput(body),
    );

    return CreateJobMapper.toResponse(result);
  }
}
