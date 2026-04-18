import type { DeleteCompanyInputDto } from '@src/modules/company/application/dto/input/delete-company.input.dto';

export interface DeleteCompanyUseCaseInterface {
  execute(input: DeleteCompanyInputDto): Promise<boolean>;
}
