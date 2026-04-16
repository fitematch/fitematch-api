import type { Provider } from '@nestjs/common';
import {
  LIST_USER_USE_CASE,
  LIST_USER_REPOSITORY,
  CREATE_USER_USE_CASE,
  CREATE_USER_REPOSITORY,
  READ_USER_USE_CASE,
  READ_USER_REPOSITORY,
  UPDATE_USER_USE_CASE,
  UPDATE_USER_REPOSITORY,
  DELETE_USER_USE_CASE,
  DELETE_USER_REPOSITORY,
} from '@src/modules/user/application/contracts/tokens/user.tokens';
import { ListUserUseCase } from '@src/modules/user/application/use-cases/list-user.use-case';
import { ListUserRepository } from '@src/modules/user/infrastructure/repositories/list-user.repository';
import { CreateUserUseCase } from '@src/modules/user/application/use-cases/create-user.use-case';
import { CreateUserRepository } from '@src/modules/user/infrastructure/repositories/create-user.repository';
import { ReadUserUseCase } from '@src/modules/user/application/use-cases/read-user.use-case';
import { ReadUserRepository } from '@src/modules/user/infrastructure/repositories/read-user.repository';
import { UpdateUserUseCase } from '@src/modules/user/application/use-cases/update-user.use-case';
import { UpdateUserRepository } from '@src/modules/user/infrastructure/repositories/update-user.repository';
import { DeleteUserUseCase } from '@src/modules/user/application/use-cases/delete-user.use-case';
import { DeleteUserRepository } from '@src/modules/user/infrastructure/repositories/delete-user.repository';

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
  {
    provide: READ_USER_USE_CASE,
    useClass: ReadUserUseCase,
  },
  {
    provide: READ_USER_REPOSITORY,
    useClass: ReadUserRepository,
  },
  {
    provide: UPDATE_USER_USE_CASE,
    useClass: UpdateUserUseCase,
  },
  {
    provide: UPDATE_USER_REPOSITORY,
    useClass: UpdateUserRepository,
  },
  {
    provide: DELETE_USER_USE_CASE,
    useClass: DeleteUserUseCase,
  },
  {
    provide: DELETE_USER_REPOSITORY,
    useClass: DeleteUserRepository,
  },
];
