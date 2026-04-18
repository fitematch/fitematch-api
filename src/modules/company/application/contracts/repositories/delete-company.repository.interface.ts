import type { DeleteCompanyInputDto } from '@src/modules/company/application/dto/input/delete-company.input.dto';

export interface DeleteCompanyRepositoryInterface {
  delete(input: DeleteCompanyInputDto): Promise<boolean>;
}
