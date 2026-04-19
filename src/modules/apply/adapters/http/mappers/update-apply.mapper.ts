import type { UpdateApplyOutputDto } from '@src/modules/apply/application/dto/output/update-apply.output.dto';
import type { UpdateApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/update-apply.response.dto';

export class UpdateApplyMapper {
  static toResponse(apply: UpdateApplyOutputDto): UpdateApplyResponseDto {
    return {
      id: apply.id,
      jobId: apply.jobId,
      userId: apply.userId,
      status: apply.status,
      createdAt: apply.createdAt,
      updatedAt: apply.updatedAt,
    };
  }
}
