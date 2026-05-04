import type { UpdateMyJobOutputDto } from '@src/modules/job/application/dto/output/update-my-job.output.dto';
import type { UpdateMyJobResponseDto } from '@src/modules/job/adapters/http/dto/response/update-my-job.response.dto';
import { UpdateJobMapper } from './update-job.mapper';

export class UpdateMyJobMapper {
  static toResponse(job: UpdateMyJobOutputDto): UpdateMyJobResponseDto {
    return UpdateJobMapper.toResponse(job);
  }
}
