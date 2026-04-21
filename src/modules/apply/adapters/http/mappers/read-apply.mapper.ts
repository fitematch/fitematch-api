import type { ReadApplyOutputDto } from '@src/modules/apply/application/dto/output/read-apply.output.dto';
import type { ReadApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/read-apply.response.dto';

export class ReadApplyMapper {
  static toResponse(apply: ReadApplyOutputDto): ReadApplyResponseDto {
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
