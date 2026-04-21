import type { ReadJobOutputDto } from '@src/modules/job/application/dto/output/read-job.output.dto';
import type { ReadJobResponseDto } from '@src/modules/job/adapters/http/dto/response/read-job.response.dto';
import CurrencyUtils from '@src/shared/utils/currency.utils';

export class ReadJobMapper {
  static toResponse(job: ReadJobOutputDto): ReadJobResponseDto {
    const currencyUtils = new CurrencyUtils();

    return {
      _id: job._id,
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
