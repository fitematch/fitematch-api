import { Inject, Injectable } from '@nestjs/common';
import type { CreateUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/create-user.use-case.interface';
import type { CreateUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/create-user.repository.interface';
import { CREATE_USER_REPOSITORY } from '@src/modules/user/application/contracts/tokens/user.tokens';
import { CreateUserInputDto } from '@src/modules/user/application/dto/input/create-user.input.dto';
import { CreateUserOutputDto } from '@src/modules/user/application/dto/output/create-user.output.dto';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

@Injectable()
export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor(
    @Inject(CREATE_USER_REPOSITORY)
    private readonly createUserRepository: CreateUserRepositoryInterface,
  ) {}

  async execute(input: CreateUserInputDto): Promise<CreateUserOutputDto> {
    return this.createUserRepository.create({
      ...input,
      status: input.status ?? UserStatusEnum.PENDING,
    });
  }
}
