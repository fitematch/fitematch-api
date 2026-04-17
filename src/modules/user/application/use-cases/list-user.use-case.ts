import { Inject, Injectable } from '@nestjs/common';
import type { ListUserUseCaseInterface } from '@src/modules/user/application/contracts/use-cases/list-user.use-case.interface';
import type { ListUserRepositoryInterface } from '@src/modules/user/application/contracts/repositories/list-user.repository.interface';
import { LIST_USER_REPOSITORY } from '@src/modules/user/application/contracts/tokens/user.tokens';
import { ListUserInputDto } from '@src/modules/user/application/dto/input/list-user.input.dto';
import { ListUserOutputDto } from '@src/modules/user/application/dto/output/list-user.output.dto';

@Injectable()
export class ListUserUseCase implements ListUserUseCaseInterface {
  constructor(
    @Inject(LIST_USER_REPOSITORY)
    private readonly listUserRepository: ListUserRepositoryInterface,
  ) {}

  async execute(input: ListUserInputDto): Promise<ListUserOutputDto[]> {
    const users = await this.listUserRepository.list(input);

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      documents: user.documents,
      contacts: user.contacts,
      media: user.media,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}
