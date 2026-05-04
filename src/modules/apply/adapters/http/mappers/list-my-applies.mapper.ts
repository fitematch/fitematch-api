import { ListMyAppliesOutput } from '@src/modules/apply/application/dto/output/list-my-applies.output';
import { ListMyAppliesResponseDto } from '@src/modules/apply/adapters/http/dto/response/list-my-applies-response.dto';

export class ListMyAppliesMapper {
  static toResponse(output: ListMyAppliesOutput): ListMyAppliesResponseDto {
    return {
      id: output.id,
      jobId: output.jobId,
      userId: output.userId,
      details: output.details,
      status: output.status,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  static toResponseList(
    output: ListMyAppliesOutput[],
  ): ListMyAppliesResponseDto[] {
    return output.map((item) => this.toResponse(item));
  }
}
