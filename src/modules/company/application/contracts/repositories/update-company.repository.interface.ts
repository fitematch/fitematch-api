import type { UpdateCompanyInputDto } from '@src/modules/company/application/dto/input/update-company.input.dto';
import type { UpdateCompanyOutputDto } from '@src/modules/company/application/dto/output/update-company.output.dto';

export interface UpdateCompanyRepositoryInterface {
  update(input: UpdateCompanyInputDto): Promise<UpdateCompanyOutputDto | null>;
}
