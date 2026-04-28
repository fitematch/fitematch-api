import { ListMyJobsOutput } from '@src/modules/job/application/dto/output/list-my-jobs.output';
import { ListMyJobsResponseDto } from '@src/modules/job/adapters/http/dto/response/list-my-jobs-response.dto';

export class ListMyJobsMapper {
  static toResponse(output: ListMyJobsOutput): ListMyJobsResponseDto {
    return {
      id: output.id,
      slug: output.slug,
      companyId: output.companyId,
      title: output.title,
      description: output.description,
      slots: output.slots,
      requirements: output.requirements,
      benefits: output.benefits,
      media: output.media,
      status: output.status,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(output: ListMyJobsOutput[]): ListMyJobsResponseDto[] {
    return output.map((item) => this.toResponse(item));
  }
}
