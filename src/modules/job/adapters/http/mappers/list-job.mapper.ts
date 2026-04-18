import { ListJobOutputDto } from '@src/modules/job/application/dto/output/list-job.output.dto';
import { ListJobResponseDto } from '@src/modules/job/adapters/http/dto/response/list-job.response.dto';

export class ListJobMapper {
  static toResponse(job: ListJobOutputDto): ListJobResponseDto {
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
