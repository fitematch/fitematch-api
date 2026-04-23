import { ListJobOutputDto } from '@src/modules/job/application/dto/output/list-job.output.dto';
import { ListJobResponseDto } from '@src/modules/job/adapters/http/dto/response/list-job.response.dto';
import CurrencyUtils from '@src/shared/utils/currency.utils';

export class ListJobMapper {
  static toResponse(job: ListJobOutputDto): ListJobResponseDto {
    const currencyUtils = new CurrencyUtils();

    return {
      _id: job._id,
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
      media: job.media,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
