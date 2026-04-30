import { CompanyEntity } from '@src/modules/company/domain/entities/company.entity';

export interface ListJobCompaniesRepository {
  findByIds(companyIds: string[]): Promise<CompanyEntity[]>;
}
