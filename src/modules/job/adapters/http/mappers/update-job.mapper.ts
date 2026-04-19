import type { UpdateJobOutputDto } from '@src/modules/job/application/dto/output/update-job.output.dto';
import type { UpdateJobResponseDto } from '@src/modules/job/adapters/http/dto/response/update-job.response.dto';

export class UpdateJobMapper {
  static toResponse(job: UpdateJobOutputDto): UpdateJobResponseDto {
    return {
      id: job.id,
      slug: job.slug,
      companyId: job.companyId,
      title: job.title,
      description: job.description,
      slots: job.slots,
      requirements: job.requirements,
      benefits: job.benefits,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
