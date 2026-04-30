import { Inject, Injectable } from '@nestjs/common';
import type { ReadJobUseCaseInterface } from '@src/modules/job/application/contracts/use-cases/read-job.use-case.interface';
import type { ReadJobRepositoryInterface } from '@src/modules/job/application/contracts/repositories/read-job.repository.interface';
import type { ListJobCompaniesRepository as ListJobCompaniesRepositoryContract } from '@src/modules/job/application/contracts/repositories/list-job-companies.repository';
import {
  LIST_JOB_COMPANIES_REPOSITORY,
  READ_JOB_REPOSITORY,
} from '@src/modules/job/application/contracts/tokens/job.tokens';
import type { ReadJobInputDto } from '@src/modules/job/application/dto/input/read-job.input.dto';
import type { ReadJobOutputDto } from '@src/modules/job/application/dto/output/read-job.output.dto';

@Injectable()
export class ReadJobUseCase implements ReadJobUseCaseInterface {
  constructor(
    @Inject(READ_JOB_REPOSITORY)
    private readonly readJobRepository: ReadJobRepositoryInterface,

    @Inject(LIST_JOB_COMPANIES_REPOSITORY)
    private readonly listJobCompaniesRepository: ListJobCompaniesRepositoryContract,
  ) {}

  async execute(input: ReadJobInputDto): Promise<ReadJobOutputDto | null> {
    const job = await this.readJobRepository.read(input);

    if (!job) {
      return null;
    }

    const companies = await this.listJobCompaniesRepository.findByIds([
      job.companyId,
    ]);
    const company = companies[0];

    return {
      ...job,
      company: company
        ? {
            id: company._id,
            tradeName: company.tradeName,
            contacts: {
              email: company.contacts?.email,
              website: company.contacts?.website,
              phone: {
                country: company.contacts?.phone?.country,
                number: company.contacts?.phone?.number,
                isWhatsapp: company.contacts?.phone?.isWhatsapp,
                isTelegram: company.contacts?.phone?.isTelegram,
              },
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
    };
  }
}
