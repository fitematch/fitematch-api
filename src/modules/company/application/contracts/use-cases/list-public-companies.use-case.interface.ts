import { ListPublicCompaniesOutput } from '@src/modules/company/application/dto/output/list-public-companies.output';

export interface ListPublicCompaniesUseCaseInterface {
  execute(): Promise<ListPublicCompaniesOutput[]>;
}
