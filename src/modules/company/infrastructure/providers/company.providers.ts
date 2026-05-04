import type { Provider } from '@nestjs/common';
import {
  LIST_COMPANY_REPOSITORY,
  LIST_COMPANY_USE_CASE,
  CREATE_COMPANY_REPOSITORY,
  CREATE_COMPANY_USE_CASE,
  READ_COMPANY_REPOSITORY,
  READ_COMPANY_USE_CASE,
  UPDATE_COMPANY_REPOSITORY,
  UPDATE_COMPANY_USE_CASE,
  DELETE_COMPANY_REPOSITORY,
  DELETE_COMPANY_USE_CASE,
  LIST_PUBLIC_COMPANIES_REPOSITORY,
  LIST_PUBLIC_COMPANIES_USE_CASE,
  READ_MY_COMPANY_REPOSITORY,
  READ_MY_COMPANY_USE_CASE,
  CREATE_MY_COMPANY_REPOSITORY,
  CREATE_MY_COMPANY_USE_CASE,
  UPDATE_MY_COMPANY_REPOSITORY,
  UPDATE_MY_COMPANY_USE_CASE,
} from '@src/modules/company/application/contracts/tokens/company.tokens';
import { ListCompanyUseCase } from '@src/modules/company/application/use-cases/list-company.use-case';
import { ListCompanyRepository } from '@src/modules/company/infrastructure/repositories/list-company.repository';
import { CreateCompanyUseCase } from '@src/modules/company/application/use-cases/create-company.use-case';
import { CreateCompanyRepository } from '@src/modules/company/infrastructure/repositories/create-company.repository';
import { ReadCompanyUseCase } from '@src/modules/company/application/use-cases/read-company.use-case';
import { ReadCompanyRepository } from '@src/modules/company/infrastructure/repositories/read-company.repository';
import { UpdateCompanyUseCase } from '@src/modules/company/application/use-cases/update-company.use-case';
import { UpdateCompanyRepository } from '@src/modules/company/infrastructure/repositories/update-company.repository';
import { DeleteCompanyUseCase } from '@src/modules/company/application/use-cases/delete-company.use-case';
import { DeleteCompanyRepository } from '@src/modules/company/infrastructure/repositories/delete-company.repository';
import { ListPublicCompaniesUseCase } from '@src/modules/company/application/use-cases/list-public-companies.use-case';
import { ListPublicCompaniesRepository } from '@src/modules/company/infrastructure/repositories/list-public-companies.repository';
import { ReadMyCompanyUseCase } from '@src/modules/company/application/use-cases/read-my-company.use-case';
import { ReadMyCompanyRepository } from '@src/modules/company/infrastructure/repositories/read-my-company.repository';
import { CreateMyCompanyUseCase } from '@src/modules/company/application/use-cases/create-my-company.use-case';
import { CreateMyCompanyRepository } from '@src/modules/company/infrastructure/repositories/create-my-company.repository';
import { UpdateMyCompanyUseCase } from '@src/modules/company/application/use-cases/update-my-company.use-case';
import { UpdateMyCompanyRepository } from '@src/modules/company/infrastructure/repositories/update-my-company.repository';

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
  {
    provide: UPDATE_COMPANY_USE_CASE,
    useClass: UpdateCompanyUseCase,
  },
  {
    provide: UPDATE_COMPANY_REPOSITORY,
    useClass: UpdateCompanyRepository,
  },
  {
    provide: DELETE_COMPANY_USE_CASE,
    useClass: DeleteCompanyUseCase,
  },
  {
    provide: DELETE_COMPANY_REPOSITORY,
    useClass: DeleteCompanyRepository,
  },
  {
    provide: LIST_PUBLIC_COMPANIES_USE_CASE,
    useClass: ListPublicCompaniesUseCase,
  },
  {
    provide: LIST_PUBLIC_COMPANIES_REPOSITORY,
    useClass: ListPublicCompaniesRepository,
  },
  {
    provide: READ_MY_COMPANY_USE_CASE,
    useClass: ReadMyCompanyUseCase,
  },
  {
    provide: READ_MY_COMPANY_REPOSITORY,
    useClass: ReadMyCompanyRepository,
  },
  {
    provide: CREATE_MY_COMPANY_USE_CASE,
    useClass: CreateMyCompanyUseCase,
  },
  {
    provide: CREATE_MY_COMPANY_REPOSITORY,
    useClass: CreateMyCompanyRepository,
  },
  {
    provide: UPDATE_MY_COMPANY_USE_CASE,
    useClass: UpdateMyCompanyUseCase,
  },
  {
    provide: UPDATE_MY_COMPANY_REPOSITORY,
    useClass: UpdateMyCompanyRepository,
  },
];
