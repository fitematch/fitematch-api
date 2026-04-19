import type { Provider } from '@nestjs/common';
import {
  LIST_APPLY_REPOSITORY,
  LIST_APPLY_USE_CASE,
  CREATE_APPLY_REPOSITORY,
  CREATE_APPLY_USE_CASE,
} from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import { ListApplyUseCase } from '@src/modules/apply/application/use-cases/list-apply.use-case';
import { ListApplyRepository } from '@src/modules/apply/infrastructure/repositories/list-apply.repository';
import { CreateApplyUseCase } from '@src/modules/apply/application/use-cases/create-apply.use-case';
import { CreateApplyRepository } from '@src/modules/apply/infrastructure/repositories/create-apply.repository';

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
];
