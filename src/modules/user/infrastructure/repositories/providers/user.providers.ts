import { Provider } from '@nestjs/common';
import {
  LIST_USER_REPOSITORY,
  LIST_USER_USE_CASE,
} from '@src/modules/user/application/contracts/tokens/user.tokens';
import { ListUserUseCase } from '@src/modules/user/application/use-cases/list-user.use-case';
import { ListUserRepository } from '@src/modules/user/infrastructure/repositories/list-user.repository';

export const userProviders: Provider[] = [
  {
    provide: LIST_USER_USE_CASE,
    useClass: ListUserUseCase,
  },
  {
    provide: LIST_USER_REPOSITORY,
    useClass: ListUserRepository,
  },
];
