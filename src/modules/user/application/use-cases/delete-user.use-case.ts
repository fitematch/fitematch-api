import { Inject, Injectable } from '@nestjs/common';

import type { DeleteUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/delete-user.use-case.interface';
import type { DeleteUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/delete-user.repository.interface';
import { DELETE_USER_REPOSITORY } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { DeleteUserInputDto } from '@src/modules/user/application/dto/input/delete-user.input.dto';

@Injectable()
export class DeleteUserUseCase implements DeleteUserUseCaseInterface {
  constructor(
    @Inject(DELETE_USER_REPOSITORY)
    private readonly deleteUserRepository: DeleteUserRepositoryInterface,
  ) {}

  async execute(input: DeleteUserInputDto): Promise<boolean> {
    return this.deleteUserRepository.delete(input);
  }
}
