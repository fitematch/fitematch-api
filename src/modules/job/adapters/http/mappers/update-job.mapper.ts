import type { UpdateJobOutputDto } from '@src/modules/job/application/dto/output/update-job.output.dto';
import type { UpdateJobResponseDto } from '@src/modules/job/adapters/http/dto/response/update-job.response.dto';
import CurrencyUtils from '@src/shared/utils/currency.utils';

export class UpdateJobMapper {
  static toResponse(job: UpdateJobOutputDto): UpdateJobResponseDto {
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
