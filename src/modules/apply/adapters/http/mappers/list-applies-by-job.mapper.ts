import { ListAppliesByJobOutput } from '@src/modules/apply/application/dto/output/list-applies-by-job.output';
import { ListAppliesByJobResponseDto } from '@src/modules/apply/adapters/http/dto/response/list-applies-by-job-response.dto';

export class ListAppliesByJobMapper {
  static toResponse(
    output: ListAppliesByJobOutput,
  ): ListAppliesByJobResponseDto {
    return {
      id: output.id,
      jobId: output.jobId,
      userId: output.userId,
      status: output.status,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(
    output: ListAppliesByJobOutput[],
  ): ListAppliesByJobResponseDto[] {
    return output.map((item) => this.toResponse(item));
  }
}
