import type { UpdateJobInputDto } from '@src/modules/job/application/dto/input/update-job.input.dto';
import type { UpdateJobParamsDto } from '@src/modules/job/adapters/http/dto/request/update-job.params.dto';
import type { UpdateJobRequestDto } from '@src/modules/job/adapters/http/dto/request/update-job.request.dto';

export class UpdateJobRequestMapper {
  static toInput(
    params: UpdateJobParamsDto,
    body: UpdateJobRequestDto,
  ): UpdateJobInputDto {
    return {
      id: params.id,
      ...body,
    };
  }
}
