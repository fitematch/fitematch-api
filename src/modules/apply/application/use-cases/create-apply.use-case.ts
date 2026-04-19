import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { CreateApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/create-apply.use-case.interface';
import type { CreateApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/create-apply.repository.interface';
import { CREATE_APPLY_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import { CreateApplyInputDto } from '@src/modules/apply/application/dto/input/create-apply.input.dto';
import { CreateApplyOutputDto } from '@src/modules/apply/application/dto/output/create-apply.output.dto';
import { ApplicationStatusEnum } from '@src/modules/apply/domain/enums/application-status.enum';

@Injectable()
export class CreateApplyUseCase implements CreateApplyUseCaseInterface {
  constructor(
    @Inject(CREATE_APPLY_REPOSITORY)
    private readonly createApplyRepository: CreateApplyRepositoryInterface,
  ) {}

  async execute(input: CreateApplyInputDto): Promise<CreateApplyOutputDto> {
    const alreadyExists =
      await this.createApplyRepository.existsByJobIdAndUserId(
        input.jobId,
        input.userId,
      );

    if (alreadyExists) {
      throw new ConflictException('User already applied to this job.');
    }

    return this.createApplyRepository.create({
      ...input,
      status: input.status ?? ApplicationStatusEnum.APPLIED,
    });
  }
}
