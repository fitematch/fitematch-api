import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UPDATE_MY_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { UpdateMyJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/update-my-job.use-case.interface';
import type { UpdateMyJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-my-job.repository.interface';
import type { UpdateMyJobInputDto } from '@src/modules/job/application/dto/input/update-my-job.input.dto';
import type { UpdateMyJobOutputDto } from '@src/modules/job/application/dto/output/update-my-job.output.dto';

@Injectable()
export class UpdateMyJobUseCase implements UpdateMyJobUseCaseInterface {
  constructor(
    @Inject(UPDATE_MY_JOB_REPOSITORY)
    private readonly updateMyJobRepository: UpdateMyJobRepositoryInterface,
  ) {}

  async execute(input: UpdateMyJobInputDto): Promise<UpdateMyJobOutputDto> {
    const companyId = await this.updateMyJobRepository.findRecruiterCompanyId(
      input.userId,
    );

    if (!companyId) {
      throw new BadRequestException(
        'Recruiter does not have a company linked to profile.',
      );
    }

    const updatedJob = await this.updateMyJobRepository.update({
      ...input,
      companyId,
    });

    if (!updatedJob) {
      throw new NotFoundException('Job not found.');
    }

    return updatedJob;
  }
}
