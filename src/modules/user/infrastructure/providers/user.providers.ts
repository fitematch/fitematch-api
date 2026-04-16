import type { Provider } from '@nestjs/common';
import {
  LIST_USER_USE_CASE,
  CREATE_USER_USE_CASE,
  READ_USER_USE_CASE,
  UPDATE_USER_USE_CASE,
  LIST_USER_REPOSITORY,
  CREATE_USER_REPOSITORY,
  READ_USER_REPOSITORY,
  UPDATE_USER_REPOSITORY,
} from '@src/modules/user/application/contracts/tokens/user.tokens';
import { ListUserUseCase } from '@src/modules/user/application/use-cases/list-user.use-case';
import { CreateUserUseCase } from '@src/modules/user/application/use-cases/create-user.use-case';
import { ReadUserUseCase } from '../../application/use-cases/read-user.use-case';
import { ListUserRepository } from '@src/modules/user/infrastructure/repositories/list-user.repository';
import { CreateUserRepository } from '@src/modules/user/infrastructure/repositories/create-user.repository';
import { ReadUserRepository } from '../repositories/read-user.repository';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';
import { UpdateUserRepository } from '../repositories/update-user.repository';

export const userProviders: Provider[] = [
  {
    provide: LIST_USER_USE_CASE,
    useClass: ListUserUseCase,
  },
  {
    provide: CREATE_USER_USE_CASE,
    useClass: CreateUserUseCase,
  },
  {
    provide: READ_USER_USE_CASE,
    useClass: ReadUserUseCase,
  },
  {
    provide: UPDATE_USER_USE_CASE,
    useClass: UpdateUserUseCase,
  },
  {
    provide: LIST_USER_REPOSITORY,
    useClass: ListUserRepository,
  },
  {
    provide: CREATE_USER_REPOSITORY,
    useClass: CreateUserRepository,
  },

  {
    provide: READ_USER_REPOSITORY,
    useClass: ReadUserRepository,
  },
  {
    provide: UPDATE_USER_REPOSITORY,
    useClass: UpdateUserRepository,
  },
];
