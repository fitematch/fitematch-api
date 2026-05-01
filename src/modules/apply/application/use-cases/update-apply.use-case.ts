import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UPDATE_APPLY_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { UpdateApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/update-apply.use-case.interface';
import type { UpdateApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/update-apply.repository.interface';
import type { UpdateApplyInputDto } from '@src/modules/apply/application/dto/input/update-apply.input.dto';
import type { UpdateApplyOutputDto } from '@src/modules/apply/application/dto/output/update-apply.output.dto';
import { READ_JOB_REPOSITORY } from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@Injectable()
export class UpdateApplyUseCase implements UpdateApplyUseCaseInterface {
  constructor(
    @Inject(UPDATE_APPLY_REPOSITORY)
    private readonly updateApplyRepository: UpdateApplyRepositoryInterface,

    @Inject(READ_JOB_REPOSITORY)
    private readonly readJobRepository: ReadJobRepositoryInterface,
  ) {}

  async execute(input: UpdateApplyInputDto): Promise<UpdateApplyOutputDto> {
    if (input.productRole !== ProductRoleEnum.RECRUITER) {
      throw new ForbiddenException('Only recruiters can update applies.');
    }

    const apply = await this.updateApplyRepository.readById(input._id);

    if (!apply) {
      throw new NotFoundException('Apply not found!');
    }

    const job = await this.readJobRepository.read({
      _id: apply.jobId,
    });

    if (!job) {
      throw new NotFoundException('Job not found!');
    }

    if (
      !input.recruiterCompanyId ||
      job.companyId !== input.recruiterCompanyId
    ) {
      throw new ForbiddenException('You are not allowed to update this apply!');
    }

    const updatedApply = await this.updateApplyRepository.update(input);

    if (!updatedApply) {
      throw new NotFoundException('Apply not found!');
    }

    return updatedApply;
  }
}
