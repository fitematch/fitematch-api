import type { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';
import type { CreateJobResponseDto } from '@src/modules/job/adapters/http/dto/response/create-job.response.dto';
import CurrencyUtils from '@src/shared/utils/currency.utils';

export class CreateJobMapper {
  static toResponse(job: CreateJobOutputDto): CreateJobResponseDto {
    const currencyUtils = new CurrencyUtils();

    return {
      id: job.id,
      slug: job.slug,
      companyId: job.companyId,
      title: job.title,
      description: job.description,
      slots: job.slots,
      requirements: job.requirements,
      benefits: job.benefits
        ? {
            ...job.benefits,
            salary:
              job.benefits.salary !== undefined
                ? currencyUtils.formatBRL(job.benefits.salary)
                : undefined,
          }
        : undefined,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
