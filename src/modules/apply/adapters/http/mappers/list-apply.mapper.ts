import type { ListApplyOutputDto } from '@src/modules/apply/application/dto/output/list-apply.output.dto';
import type { ListApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/list-apply.response.dto';

export class ListApplyMapper {
  static toResponse(apply: ListApplyOutputDto): ListApplyResponseDto {
    return {
      _id: apply._id,
      jobId: apply.jobId,
      userId: apply.userId,
      status: apply.status,
      createdAt: apply.createdAt,
      updatedAt: apply.updatedAt,
    };
  }
}
