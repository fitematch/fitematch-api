import { UpdateMyCompanyInputDto } from '@src/modules/company/application/dto/input/update-my-company.input.dto';
import { UpdateMyCompanyOutputDto } from '@src/modules/company/application/dto/output/update-my-company.output.dto';

export interface UpdateMyCompanyRepositoryInterface {
  update(
    input: UpdateMyCompanyInputDto,
  ): Promise<UpdateMyCompanyOutputDto | null>;
}
