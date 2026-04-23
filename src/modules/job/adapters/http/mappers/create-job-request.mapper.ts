import type { CreateJobInputDto } from '@src/modules/job/application/dto/input/create-job.input.dto';
import type { CreateJobRequestDto } from '@src/modules/job/adapters/http/dto/request/create-job.request.dto';

export class CreateJobRequestMapper {
  static toInput(body: CreateJobRequestDto): CreateJobInputDto {
    return {
      slug: body.slug,
      companyId: body.companyId,
      title: body.title,
      description: body.description,
      slots: body.slots,
      requirements: body.requirements,
      benefits: body.benefits,
      media: body.media,
      status: body.status,
    };
  }
}
