import { Inject, Injectable } from '@nestjs/common';
import type { ReadJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/read-job.use-case.interface';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import { READ_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { ReadJobInputDto } from '@src/modules/job/application/dto/input/read-job.input.dto';
import type { ReadJobOutputDto } from '@src/modules/job/application/dto/output/read-job.output.dto';

@Injectable()
export class ReadJobUseCase implements ReadJobUseCaseInterface {
  constructor(
    @Inject(READ_JOB_REPOSITORY)
    private readonly readJobRepository: ReadJobRepositoryInterface,
  ) {}

  async execute(input: ReadJobInputDto): Promise<ReadJobOutputDto | null> {
    return this.readJobRepository.read(input);
  }
}
