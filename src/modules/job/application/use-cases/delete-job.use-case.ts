import { Inject, Injectable } from '@nestjs/common';
import { DELETE_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { DeleteJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/delete-job.use-case.interface';
import type { DeleteJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/delete-job.repository.interface';
import type { DeleteJobInputDto } from '@src/modules/job/application/dto/input/delete-job.input.dto';

@Injectable()
export class DeleteJobUseCase implements DeleteJobUseCaseInterface {
  constructor(
    @Inject(DELETE_JOB_REPOSITORY)
    private readonly deleteJobRepository: DeleteJobRepositoryInterface,
  ) {}

  async execute(input: DeleteJobInputDto): Promise<boolean> {
    return this.deleteJobRepository.delete(input);
  }
}
