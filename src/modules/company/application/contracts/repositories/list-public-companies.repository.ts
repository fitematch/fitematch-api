import { CompanyEntity } from '@src/modules/company/domain/entities/company.entity';

export interface ListPublicCompaniesRepository {
  findPublicActiveCompanies(): Promise<CompanyEntity[]>;
}
