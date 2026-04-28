import { Inject, Injectable } from '@nestjs/common';

import type { ListMyAppliesRepository } from '@src/modules/apply/application/contracts/repositories/list-my-applies.repository';
import { LIST_MY_APPLIES_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import { ListMyAppliesInput } from '@src/modules/apply/application/dto/input/list-my-applies.input';
import { ListMyAppliesOutput } from '@src/modules/apply/application/dto/output/list-my-applies.output';

@Injectable()
export class ListMyAppliesUseCase {
  constructor(
    @Inject(LIST_MY_APPLIES_REPOSITORY)
    private readonly listMyAppliesRepository: ListMyAppliesRepository,
  ) {}

  async execute(input: ListMyAppliesInput): Promise<ListMyAppliesOutput[]> {
    const applies = await this.listMyAppliesRepository.findByUserId(
      input.userId,
    );

    return applies.map((apply) => ({
      id: apply._id,
      jobId: apply.jobId,
      userId: apply.userId,
      status: apply.status,
      createdAt: apply.createdAt,
      updatedAt: apply.updatedAt,
    }));
  }
}
