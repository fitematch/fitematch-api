import { Inject, Injectable } from '@nestjs/common';
import { DELETE_APPLY_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { DeleteApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/delete-apply.use-case.interface';
import type { DeleteApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/delete-apply.repository.interface';
import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';

@Injectable()
export class DeleteApplyUseCase implements DeleteApplyUseCaseInterface {
  constructor(
    @Inject(DELETE_APPLY_REPOSITORY)
    private readonly deleteApplyRepository: DeleteApplyRepositoryInterface,
  ) {}

  async execute(input: DeleteApplyInputDto): Promise<boolean> {
    return this.deleteApplyRepository.delete(input);
  }
}
