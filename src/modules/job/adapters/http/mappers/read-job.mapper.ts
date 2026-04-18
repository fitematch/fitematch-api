import type { ReadJobOutputDto } from '@src/modules/job/application/dto/output/read-job.output.dto';
import type { ReadJobResponseDto } from '@src/modules/job/adapters/http/dto/response/read-job.response.dto';

export class ReadJobMapper {
  static toResponse(job: ReadJobOutputDto): ReadJobResponseDto {
    return {
      id: job.id,
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
