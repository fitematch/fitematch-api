import { Inject, Injectable } from '@nestjs/common';
import { UPDATE_APPLY_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { UpdateApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/update-apply.use-case.interface';
import type { UpdateApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/update-apply.repository.interface';
import type { UpdateApplyInputDto } from '@src/modules/apply/application/dto/input/update-apply.input.dto';
import type { UpdateApplyOutputDto } from '@src/modules/apply/application/dto/output/update-apply.output.dto';

@Injectable()
export class UpdateApplyUseCase implements UpdateApplyUseCaseInterface {
  constructor(
    @Inject(UPDATE_APPLY_REPOSITORY)
    private readonly updateApplyRepository: UpdateApplyRepositoryInterface,
  ) {}

  async execute(
    input: UpdateApplyInputDto,
  ): Promise<UpdateApplyOutputDto | null> {
    return this.updateApplyRepository.update(input);
  }
}
