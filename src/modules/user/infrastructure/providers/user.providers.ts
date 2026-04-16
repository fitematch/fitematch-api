import type { Provider } from '@nestjs/common';
import {
  CREATE_USER_REPOSITORY,
  CREATE_USER_USE_CASE,
  LIST_USER_REPOSITORY,
  LIST_USER_USE_CASE,
} from '@src/modules/user/application/contracts/tokens/user.tokens';
import { CreateUserUseCase } from '@src/modules/user/application/use-cases/create-user.use-case';
import { ListUserUseCase } from '@src/modules/user/application/use-cases/list-user.use-case';
import { CreateUserRepository } from '@src/modules/user/infrastructure/repositories/create-user.repository';
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
  {
    provide: CREATE_USER_USE_CASE,
    useClass: CreateUserUseCase,
  },
  {
    provide: CREATE_USER_REPOSITORY,
    useClass: CreateUserRepository,
  },
];
