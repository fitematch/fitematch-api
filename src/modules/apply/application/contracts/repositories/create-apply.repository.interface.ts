import type { CreateApplyInputDto } from '@src/modules/apply/application/dto/input/create-apply.input.dto';
import type { CreateApplyOutputDto } from '@src/modules/apply/application/dto/output/create-apply.output.dto';

export interface CreateApplyRepositoryInterface {
  existsByJobIdAndUserId(jobId: string, userId: string): Promise<boolean>;
  create(input: CreateApplyInputDto): Promise<CreateApplyOutputDto>;
}
