import type { CreateJobOutputDto } from '@src/modules/job/application/dto/output/create-job.output.dto';
import type { CreateJobResponseDto } from '@src/modules/job/adapters/http/dto/response/create-job.response.dto';

export class CreateJobMapper {
  static toResponse(job: CreateJobOutputDto): CreateJobResponseDto {
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
