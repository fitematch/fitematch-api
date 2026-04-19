import { Inject, Injectable } from '@nestjs/common';
import { LIST_APPLY_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { ListApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/list-apply.use-case.interface';
import type { ListApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/list-apply.repository.interface';
import type { ListApplyInputDto } from '@src/modules/apply/application/dto/input/list-apply.input.dto';
import type { ListApplyOutputDto } from '@src/modules/apply/application/dto/output/list-apply.output.dto';

@Injectable()
export class ListApplyUseCase implements ListApplyUseCaseInterface {
  constructor(
    @Inject(LIST_APPLY_REPOSITORY)
    private readonly listApplyRepository: ListApplyRepositoryInterface,
  ) {}

  async execute(input: ListApplyInputDto): Promise<ListApplyOutputDto[]> {
    const applies = await this.listApplyRepository.list(input);

    return applies.map((apply) => ({
      id: apply.id,
      jobId: apply.jobId,
      userId: apply.userId,
      status: apply.status,
      createdAt: apply.createdAt,
      updatedAt: apply.updatedAt,
    }));
  }
}
