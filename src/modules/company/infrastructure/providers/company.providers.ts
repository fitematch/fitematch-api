import type { Provider } from '@nestjs/common';
import {
  LIST_COMPANY_REPOSITORY,
  LIST_COMPANY_USE_CASE,
} from '@src/modules/company/application/contracts/tokens/company.tokens';
import { ListCompanyUseCase } from '@src/modules/company/application/use-cases/list-company.use-case';
import { ListCompanyRepository } from '@src/modules/company/infrastructure/repositories/list-company.repository';

export const companyProviders: Provider[] = [
  {
    provide: LIST_COMPANY_USE_CASE,
    useClass: ListCompanyUseCase,
  },
  {
    provide: LIST_COMPANY_REPOSITORY,
    useClass: ListCompanyRepository,
  },
];
