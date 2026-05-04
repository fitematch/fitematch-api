import type { AuthUserPayload } from '@src/modules/auth/application/dto/auth-user-payload';
import type { UpdateMyJobParamsDto } from '@src/modules/job/adapters/http/dto/request/update-my-job.params.dto';
import type { UpdateMyJobRequestDto } from '@src/modules/job/adapters/http/dto/request/update-my-job.request.dto';
import type { UpdateMyJobInputDto } from '@src/modules/job/application/dto/input/update-my-job.input.dto';

export class UpdateMyJobRequestMapper {
  static toInput(
    user: AuthUserPayload,
    params: UpdateMyJobParamsDto,
    body: UpdateMyJobRequestDto,
  ): UpdateMyJobInputDto {
    return {
      userId: user.id,
      _id: params.jobId,
      title: body.title,
      description: body.description,
      slots: body.slots,
      requirements: body.requirements,
      benefits: body.benefits,
      media: body.media,
      contractType: body.contractType,
      status: body.status,
    };
  }
}
