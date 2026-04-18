import type { Provider } from '@nestjs/common';
import {
  LIST_COMPANY_REPOSITORY,
  LIST_COMPANY_USE_CASE,
  CREATE_COMPANY_REPOSITORY,
  CREATE_COMPANY_USE_CASE,
  READ_COMPANY_REPOSITORY,
  READ_COMPANY_USE_CASE,
} from '@src/modules/company/application/contracts/tokens/company.tokens';
import { ListCompanyUseCase } from '@src/modules/company/application/use-cases/list-company.use-case';
import { ListCompanyRepository } from '@src/modules/company/infrastructure/repositories/list-company.repository';
import { CreateCompanyUseCase } from '@src/modules/company/application/use-cases/create-company.use-case';
import { CreateCompanyRepository } from '@src/modules/company/infrastructure/repositories/create-company.repository';
import { ReadCompanyUseCase } from '@src/modules/company/application/use-cases/read-company.use-case';
import { ReadCompanyRepository } from '@src/modules/company/infrastructure/repositories/read-company.repository';

export const companyProviders: Provider[] = [
  {
    provide: LIST_COMPANY_USE_CASE,
    useClass: ListCompanyUseCase,
  },
  {
    provide: LIST_COMPANY_REPOSITORY,
    useClass: ListCompanyRepository,
  },
  {
    provide: CREATE_COMPANY_USE_CASE,
    useClass: CreateCompanyUseCase,
  },
  {
    provide: CREATE_COMPANY_REPOSITORY,
    useClass: CreateCompanyRepository,
  },
  {
    provide: READ_COMPANY_USE_CASE,
    useClass: ReadCompanyUseCase,
  },
  {
    provide: READ_COMPANY_REPOSITORY,
    useClass: ReadCompanyRepository,
  },
];
