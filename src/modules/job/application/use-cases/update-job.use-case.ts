import { Inject, Injectable } from '@nestjs/common';
import { UPDATE_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { UpdateJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/update-job.use-case.interface';
import type { UpdateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-job.repository.interface';
import type { UpdateJobInputDto } from '@src/modules/job/application/dto/input/update-job.input.dto';
import type { UpdateJobOutputDto } from '@src/modules/job/application/dto/output/update-job.output.dto';

@Injectable()
export class UpdateJobUseCase implements UpdateJobUseCaseInterface {
  constructor(
    @Inject(UPDATE_JOB_REPOSITORY)
    private readonly updateJobRepository: UpdateJobRepositoryInterface,
  ) {}

  async execute(input: UpdateJobInputDto): Promise<UpdateJobOutputDto | null> {
    return this.updateJobRepository.update(input);
  }
}
