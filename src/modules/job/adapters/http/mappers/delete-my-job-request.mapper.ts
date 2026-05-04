import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import type { DeleteMyJobParamsDto } from '@src/modules/job/adapters/http/dto/request/delete-my-job.params.dto';
import type { DeleteMyJobInputDto } from '@src/modules/job/application/dto/input/delete-my-job.input.dto';

export class DeleteMyJobRequestMapper {
  static toInput(
    user: AuthUserPayload,
    params: DeleteMyJobParamsDto,
  ): DeleteMyJobInputDto {
    return {
      userId: user.id,
      _id: params.jobId,
    };
  }
}
