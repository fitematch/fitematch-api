import { Inject, Injectable } from '@nestjs/common';
import type { UpdateUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/update-user.use-case.interface';
import type { UpdateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/update-user.repository.interface';
import { UPDATE_USER_REPOSITORY } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { UpdateUserInputDto } from '@src/modules/user/application/dto/input/update-user.input.dto';
import type { UpdateUserOutputDto } from '@src/modules/user/application/dto/output/update-user.output.dto';
import EncryptUtils from '@src/shared/utils/encrypt.utils';

@Injectable()
export class UpdateUserUseCase implements UpdateUserUseCaseInterface {
  constructor(
    @Inject(UPDATE_USER_REPOSITORY)
    private readonly updateUserRepository: UpdateUserRepositoryInterface,
    private readonly encryptUtils: EncryptUtils,
  ) {}

  async execute(
    input: UpdateUserInputDto,
  ): Promise<UpdateUserOutputDto | null> {
    const password = input.password
      ? await this.encryptUtils.encryptPassword(input.password)
      : undefined;

    return this.updateUserRepository.update({
      ...input,
      ...(password !== undefined && { password }),
    });
  }
}
