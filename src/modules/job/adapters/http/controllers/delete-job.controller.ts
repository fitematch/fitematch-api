import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DELETE_JOB_USE_CASE } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { DeleteJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/delete-job.use-case.interface';
import { DeleteJobParamsDto } from '@src/modules/job/adapters/http/dto/request/delete-job.params.dto';
import { DeleteJobRequestMapper } from '@src/modules/job/adapters/http/mappers/delete-job-request.mapper';

@ApiTags('Job')
@ApiBearerAuth('JWT')
@Controller('job')
export class DeleteJobController {
  constructor(
    @Inject(DELETE_JOB_USE_CASE)
    private readonly deleteJobUseCase: DeleteJobUseCaseInterface,
  ) {}

  @ApiOperation({
    summary: 'Delete one job position',
    description: 'Deletes a job position by ID.',
  })
  @ApiNoContentResponse({
    description: 'Job position deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Job not found.',
  })
  @Delete(':jobId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param() params: DeleteJobParamsDto): Promise<void> {
    const deleted = await this.deleteJobUseCase.execute(
      DeleteJobRequestMapper.toInput(params),
    );

    if (!deleted) {
      throw new NotFoundException('Job not found.');
    }
  }
}
