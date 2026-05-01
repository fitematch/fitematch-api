import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UPDATE_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { UpdateJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/update-job.use-case.interface';
import type { UpdateJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/update-job.repository.interface';
import type { UpdateJobInputDto } from '@src/modules/job/application/dto/input/update-job.input.dto';
import type { UpdateJobOutputDto } from '@src/modules/job/application/dto/output/update-job.output.dto';

import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@Injectable()
export class UpdateJobUseCase implements UpdateJobUseCaseInterface {
  constructor(
    @Inject(UPDATE_JOB_REPOSITORY)
    private readonly updateJobRepository: UpdateJobRepositoryInterface,
  ) {}

  async execute(input: UpdateJobInputDto): Promise<UpdateJobOutputDto> {
    if (input.productRole !== ProductRoleEnum.RECRUITER) {
      throw new ForbiddenException('Only recruiters can update jobs.');
    }

    const job = await this.updateJobRepository.readById(input._id);

    if (!job) {
      throw new NotFoundException('Job not found.');
    }

    if (
      !input.recruiterCompanyId ||
      job.companyId !== input.recruiterCompanyId
    ) {
      throw new ForbiddenException('You are not allowed to update this job.');
    }

    const updatedJob = await this.updateJobRepository.update(input);

    if (!updatedJob) {
      throw new NotFoundException('Job not found.');
    }

    return updatedJob;
  }
}
