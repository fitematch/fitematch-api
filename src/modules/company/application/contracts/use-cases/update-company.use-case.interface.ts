import type { UpdateCompanyInputDto } from '@src/modules/company/application/dto/input/update-company.input.dto';
import type { UpdateCompanyOutputDto } from '@src/modules/company/application/dto/output/update-company.output.dto';

export interface UpdateCompanyUseCaseInterface {
  execute(input: UpdateCompanyInputDto): Promise<UpdateCompanyOutputDto | null>;
}
