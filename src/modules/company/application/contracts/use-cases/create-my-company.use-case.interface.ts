import { CreateMyCompanyInputDto } from '@src/modules/company/application/dto/input/create-my-company.input.dto';
import { CreateMyCompanyOutputDto } from '@src/modules/company/application/dto/output/create-my-company.output.dto';

export interface CreateMyCompanyUseCaseInterface {
  execute(input: CreateMyCompanyInputDto): Promise<CreateMyCompanyOutputDto>;
}
