import { Inject, Injectable } from '@nestjs/common';
import type { ListJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/list-job.use-case.interface';
import type { ListJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/list-job.repository.interface';
import type { ListJobCompaniesRepository as ListJobCompaniesRepositoryContract } from '@src/modules/job/application/contracts/repositories/list-job-companies.repository';
import {
  LIST_JOB_COMPANIES_REPOSITORY,
  LIST_JOB_REPOSITORY,
} from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { ListJobInputDto } from '@src/modules/job/application/dto/input/list-job.input.dto';
import type { ListJobOutputDto } from '@src/modules/job/application/dto/output/list-job.output.dto';

@Injectable()
export class ListJobUseCase implements ListJobUseCaseInterface {
  constructor(
    @Inject(LIST_JOB_REPOSITORY)
    private readonly listJobRepository: ListJobRepositoryInterface,

    @Inject(LIST_JOB_COMPANIES_REPOSITORY)
    private readonly listJobCompaniesRepository: ListJobCompaniesRepositoryContract,
  ) {}

  async execute(input: ListJobInputDto): Promise<ListJobOutputDto[]> {
    const jobs = await this.listJobRepository.list(input);

    const companyIds = [...new Set(jobs.map((job) => job.companyId))];

    const companies =
      await this.listJobCompaniesRepository.findByIds(companyIds);

    const companyMap = new Map(
      companies.map((company) => [company._id, company]),
    );

    return jobs.map((job) => {
      const company = companyMap.get(job.companyId);

      return {
        _id: job._id,
        slug: job.slug,
        companyId: job.companyId,
        title: job.title,
        description: job.description,
        slots: job.slots,
        requirements: job.requirements,
        benefits: job.benefits,
        media: job.media,
        company: company
          ? {
              id: company._id,
              tradeName: company.tradeName,
              contacts: {
                email: company.contacts?.email,
                website: company.contacts?.website,
                address: {
                  street: company.contacts?.address?.street,
                  number: company.contacts?.address?.number,
                  complement: company.contacts?.address?.complement,
                  neighborhood: company.contacts?.address?.neighborhood,
                  city: company.contacts?.address?.city,
                  state: company.contacts?.address?.state,
                  country: company.contacts?.address?.country,
                  zipCode: company.contacts?.address?.zipCode,
                },
              },
              media: {
                logoUrl: company.media?.logoUrl,
              },
            }
          : undefined,
        status: job.status,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      };
    });
  }
}
