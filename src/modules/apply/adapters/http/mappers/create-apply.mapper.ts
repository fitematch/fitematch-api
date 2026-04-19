import type { CreateApplyOutputDto } from '@src/modules/apply/application/dto/output/create-apply.output.dto';
import type { CreateApplyResponseDto } from '@src/modules/apply/adapters/http/dto/response/create-apply.response.dto';

export class CreateApplyMapper {
  static toResponse(apply: CreateApplyOutputDto): CreateApplyResponseDto {
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
