import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { READ_APPLY_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ReadApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/read-apply.use-case.interface';
import type { ReadApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/read-apply.repository.interface';
import type { ReadApplyInputDto } from '@src/modules/apply/application/dto/input/read-apply.input.dto';
import type { ReadApplyOutputDto } from '@src/modules/apply/application/dto/output/read-apply.output.dto';
import { READ_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@Injectable()
export class ReadApplyUseCase implements ReadApplyUseCaseInterface {
  constructor(
    @Inject(READ_APPLY_REPOSITORY)
    private readonly readApplyRepository: ReadApplyRepositoryInterface,

    @Inject(READ_JOB_REPOSITORY)
    private readonly readJobRepository: ReadJobRepositoryInterface,
  ) {}

  async execute(input: ReadApplyInputDto): Promise<ReadApplyOutputDto> {
    const apply = await this.readApplyRepository.read(input);

    if (!apply) {
      throw new NotFoundException('Apply not found!');
    }

    if (input.productRole === ProductRoleEnum.CANDIDATE) {
      if (apply.userId !== input.userId) {
        throw new ForbiddenException('You are not allowed to read this apply!');
      }

      return apply;
    }

    if (input.productRole === ProductRoleEnum.RECRUITER) {
      const job = await this.readJobRepository.read({
        _id: apply.jobId,
      });

      if (!job) {
        throw new NotFoundException('Job not found.');
      }

      if (
        !input.recruiterCompanyId ||
        job.companyId !== input.recruiterCompanyId
      ) {
        throw new ForbiddenException('You are not allowed to read this apply!');
      }

      return apply;
    }

    throw new ForbiddenException('You are not allowed to read this apply!');
  }
}
