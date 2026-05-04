import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DELETE_MY_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { DeleteMyJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/delete-my-job.use-case.interface';
import type { DeleteMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/delete-my-job.repository.interface';
import type { DeleteMyJobInputDto } from '@src/modules/job/application/dto/input/delete-my-job.input.dto';

@Injectable()
export class DeleteMyJobUseCase implements DeleteMyJobUseCaseInterface {
  constructor(
    @Inject(DELETE_MY_JOB_REPOSITORY)
    private readonly deleteMyJobRepository: DeleteMyJobRepositoryInterface,
  ) {}

  async execute(input: DeleteMyJobInputDto): Promise<boolean> {
    const companyId = await this.deleteMyJobRepository.findRecruiterCompanyId(
      input.userId,
    );

    if (!companyId) {
      throw new BadRequestException(
        'Recruiter does not have a company linked to profile.',
      );
    }

    const deleted = await this.deleteMyJobRepository.delete({
      ...input,
      companyId,
    });

    if (!deleted) {
      throw new NotFoundException('Job not found.');
    }

    return deleted;
  }
}
