import type { DeleteJobInputDto } from '@src/modules/job/application/dto/input/delete-job.input.dto';
import type { DeleteJobParamsDto } from '@src/modules/job/adapters/http/dto/request/delete-job.params.dto';

export class DeleteJobRequestMapper {
  static toInput(params: DeleteJobParamsDto): DeleteJobInputDto {
    return {
      id: params.id,
    };
  }
}
