import type { UpdateJobInputDto } from '@src/modules/job/application/dto/input/update-job.input.dto';
import type { UpdateJobParamsDto } from '@src/modules/job/adapters/http/dto/request/update-job.params.dto';
import type { UpdateJobRequestDto } from '@src/modules/job/adapters/http/dto/request/update-job.request.dto';
import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';

export class UpdateJobRequestMapper {
  static toInput(
    params: UpdateJobParamsDto,
    body: UpdateJobRequestDto,
    user: AuthUserPayload,
  ): UpdateJobInputDto {
    return {
      _id: params.jobId,
      ...body,
      productRole: user.productRole,
      recruiterCompanyId: user.recruiterProfile?.companyId,
    };
  }
}
