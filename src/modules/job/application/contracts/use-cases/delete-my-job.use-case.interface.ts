import { DeleteMyJobInputDto } from '@src/modules/job/application/dto/input/delete-my-job.input.dto';

export interface DeleteMyJobUseCaseInterface {
  execute(input: DeleteMyJobInputDto): Promise<boolean>;
}
