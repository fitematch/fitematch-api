import type { ReadJobInputDto } from '@src/modules/job/application/dto/input/read-job.input.dto';
import type { ReadJobParamsDto } from '@src/modules/job/adapters/http/dto/request/read-job.params.dto';

export class ReadJobRequestMapper {
  static toInput(params: ReadJobParamsDto): ReadJobInputDto {
    return {
      id: params.id,
    };
  }
}
