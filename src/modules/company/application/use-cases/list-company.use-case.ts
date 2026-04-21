import { Inject, Injectable } from '@nestjs/common';
import type { ListCompanyUseCaseInterface } from '@src/modules/company/application/contracts/use-cases/list-company.use-case.interface';
import type { ListCompanyRepositoryInterface } from '@src/modules/company/application/contracts/repositories/list-company.repository.interface';
import { LIST_COMPANY_REPOSITORY } from '@src/modules/company/application/contracts/tokens/company.tokens';
import { ListCompanyInputDto } from '@src/modules/company/application/dto/input/list-company.input.dto';
import { ListCompanyOutputDto } from '@src/modules/company/application/dto/output/list-company.output.dto';

@Injectable()
export class ListCompanyUseCase implements ListCompanyUseCaseInterface {
  constructor(
    @Inject(LIST_COMPANY_REPOSITORY)
    private readonly listCompanyRepository: ListCompanyRepositoryInterface,
  ) {}

  async execute(input: ListCompanyInputDto): Promise<ListCompanyOutputDto[]> {
    const companies = await this.listCompanyRepository.list(input);

    return companies.map((company) => ({
      _id: company._id,
      slug: company.slug,
      tradeName: company.tradeName,
      legalName: company.legalName,
      contacts: company.contacts,
      documents: company.documents,
      media: company.media,
      audit: company.audit,
      approval: company.approval,
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));
  }
}
