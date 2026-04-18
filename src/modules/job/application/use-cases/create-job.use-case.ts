import { Inject, Injectable } from '@nestjs/common';
import type { CreateJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/create-job.use-case.interface';
import type { CreateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/create-job.repository.interface';
import { CREATE_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import { CreateJobInputDto } from '@src/modules/job/application/dto/input/create-job.input.dto';
import { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';
import { JobStatusEnum } from '@src/modules/job/domain/enums/job-status.enum';

@Injectable()
export class CreateJobUseCase implements CreateJobUseCaseInterface {
  constructor(
    @Inject(CREATE_JOB_REPOSITORY)
    private readonly createJobRepository: CreateJobRepositoryInterface,
  ) {}

  async execute(input: CreateJobInputDto): Promise<CreateJobOutputDto> {
    return this.createJobRepository.create({
      ...input,
      status: input.status ?? JobStatusEnum.PENDING,
    });
  }
}
