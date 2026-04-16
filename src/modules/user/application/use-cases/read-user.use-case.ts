import { Inject, Injectable } from '@nestjs/common';
import type { ReadUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/read-user.use-case.interface';
import type { ReadUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/read-user.repository.interface';
import { READ_USER_REPOSITORY } from '@src/modules/user/application/contracts/tokens/user.tokens';
import type { ReadUserInputDto } from '@src/modules/user/application/dto/input/read-user.input.dto';
import type { ReadUserOutputDto } from '@src/modules/user/application/dto/output/read-user.output.dto';

@Injectable()
export class ReadUserUseCase implements ReadUserUseCaseInterface {
  constructor(
    @Inject(READ_USER_REPOSITORY)
    private readonly readUserRepository: ReadUserRepositoryInterface,
  ) {}

  async execute(input: ReadUserInputDto): Promise<ReadUserOutputDto | null> {
    return this.readUserRepository.read(input);
  }
}
