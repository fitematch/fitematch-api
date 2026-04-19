import type { CreateApplyInputDto } from '@src/modules/apply/application/dto/input/create-apply.input.dto';
import type { CreateApplyRequestDto } from '@src/modules/apply/adapters/http/dto/request/create-apply.request.dto';

export class CreateApplyRequestMapper {
  static toInput(body: CreateApplyRequestDto): CreateApplyInputDto {
    return {
      jobId: body.jobId,
      userId: body.userId,
      status: body.status,
    };
  }
}
