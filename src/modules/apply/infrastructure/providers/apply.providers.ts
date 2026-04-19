import type { Provider } from '@nestjs/common';
import {
  LIST_APPLY_REPOSITORY,
  LIST_APPLY_USE_CASE,
  CREATE_APPLY_REPOSITORY,
  CREATE_APPLY_USE_CASE,
  READ_APPLY_REPOSITORY,
  READ_APPLY_USE_CASE,
  UPDATE_APPLY_REPOSITORY,
  UPDATE_APPLY_USE_CASE,
} from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import { ListApplyUseCase } from '@src/modules/apply/application/use-cases/list-apply.use-case';
import { ListApplyRepository } from '@src/modules/apply/infrastructure/repositories/list-apply.repository';
import { CreateApplyUseCase } from '@src/modules/apply/application/use-cases/create-apply.use-case';
import { CreateApplyRepository } from '@src/modules/apply/infrastructure/repositories/create-apply.repository';
import { ReadApplyUseCase } from '@src/modules/apply/application/use-cases/read-apply.use-case';
import { ReadApplyRepository } from '@src/modules/apply/infrastructure/repositories/read-apply.repository';
import { UpdateApplyUseCase } from '@src/modules/apply/application/use-cases/update-apply.use-case';
import { UpdateApplyRepository } from '@src/modules/apply/infrastructure/repositories/update-apply.repository';

export const applyProviders: Provider[] = [
  {
    provide: LIST_APPLY_USE_CASE,
    useClass: ListApplyUseCase,
  },
  {
    provide: LIST_APPLY_REPOSITORY,
    useClass: ListApplyRepository,
  },
  {
    provide: CREATE_APPLY_USE_CASE,
    useClass: CreateApplyUseCase,
  },
  {
    provide: CREATE_APPLY_REPOSITORY,
    useClass: CreateApplyRepository,
  },
  {
    provide: READ_APPLY_USE_CASE,
    useClass: ReadApplyUseCase,
  },
  {
    provide: READ_APPLY_REPOSITORY,
    useClass: ReadApplyRepository,
  },
  {
    provide: UPDATE_APPLY_USE_CASE,
    useClass: UpdateApplyUseCase,
  },
  {
    provide: UPDATE_APPLY_REPOSITORY,
    useClass: UpdateApplyRepository,
  },
];
