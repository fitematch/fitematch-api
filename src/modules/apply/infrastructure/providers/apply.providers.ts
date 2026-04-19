import type { Provider } from '@nestjs/common';
import {
  CREATE_APPLY_REPOSITORY,
  CREATE_APPLY_USE_CASE,
} from '@src/modules/apply/application/contracts/tokens/apply.tokens';
import { CreateApplyUseCase } from '@src/modules/apply/application/use-cases/create-apply.use-case';
import { CreateApplyRepository } from '@src/modules/apply/infrastructure/repositories/create-apply.repository';

export const applyProviders: Provider[] = [
  {
    provide: CREATE_APPLY_USE_CASE,
    useClass: CreateApplyUseCase,
  },
  {
    provide: CREATE_APPLY_REPOSITORY,
    useClass: CreateApplyRepository,
  },
];
