import { DeleteMyJobInputDto } from '@src/modules/job/application/dto/input/delete-my-job.input.dto';

export interface DeleteMyJobRepositoryInterface {
  findRecruiterCompanyId(userId: string): Promise<string | null>;
  delete(input: DeleteMyJobInputDto & { companyId: string }): Promise<boolean>;
}
