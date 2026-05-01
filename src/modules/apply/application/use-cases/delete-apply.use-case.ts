import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DELETE_APPLY_REPOSITORY } from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import type { DeleteApplyUseCaseInterface } from '@src/modules/apply/application/contracts/use-cases/delete-apply.use-case.interface';
import type { DeleteApplyRepositoryInterface } from '@src/modules/apply/application/contracts/repositories/delete-apply.repository.interface';
import type { DeleteApplyInputDto } from '@src/modules/apply/application/dto/input/delete-apply.input.dto';
import { ProductRoleEnum } from '@src/modules/user/domain/enums/product-role.enum';

@Injectable()
export class DeleteApplyUseCase implements DeleteApplyUseCaseInterface {
  constructor(
    @Inject(DELETE_APPLY_REPOSITORY)
    private readonly deleteApplyRepository: DeleteApplyRepositoryInterface,
  ) {}

  async execute(input: DeleteApplyInputDto): Promise<boolean> {
    const apply = await this.deleteApplyRepository.readById(input._id);

    if (!apply) {
      throw new NotFoundException('Apply not found!');
    }

    if (input.productRole !== ProductRoleEnum.CANDIDATE) {
      throw new ForbiddenException('Only candidates can delete applies.');
    }

    if (apply.userId !== input.userId) {
      throw new ForbiddenException('You are not allowed to delete this apply!');
    }

    return this.deleteApplyRepository.delete(input);
  }
}
