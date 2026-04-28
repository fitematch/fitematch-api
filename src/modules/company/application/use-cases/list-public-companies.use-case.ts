import { Inject, Injectable } from '@nestjs/common';

import { LIST_PUBLIC_COMPANIES_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import type { ListPublicCompaniesRepository } from '@src/modules/company/application/contracts/repositories/list-public-companies.repository';
import type { ListPublicCompaniesOutput } from '@src/modules/company/application/dto/output/list-public-companies.output';

@Injectable()
export class ListPublicCompaniesUseCase {
  constructor(
    @Inject(LIST_PUBLIC_COMPANIES_REPOSITORY)
    private readonly repository: ListPublicCompaniesRepository,
  ) {}

  async execute(): Promise<ListPublicCompaniesOutput[]> {
    const companies = await this.repository.findPublicActiveCompanies();

    return companies.map((company) => ({
      id: company._id,
      slug: company.slug,
      tradeName: company.tradeName,
      media: company.media
        ? {
            logoUrl: company.media.logoUrl,
          }
        : undefined,
    }));
  }
}
