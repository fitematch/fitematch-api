import type { CreateMyJobOutputDto } from '@src/modules/job/application/dto/output/create-my-job.output.dto';
import type { CreateMyJobResponseDto } from '@src/modules/job/adapters/http/dto/response/create-my-job.response.dto';
import { CreateJobMapper } from './create-job.mapper';

export class CreateMyJobMapper {
  static toResponse(job: CreateMyJobOutputDto): CreateMyJobResponseDto {
    return CreateJobMapper.toResponse(job);
  }
}
