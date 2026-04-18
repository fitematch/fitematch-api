import { CreateCompanyInputDto } from '@src/modules/company/application/dto/input/create-company.input.dto';
import { CreateCompanyOutputDto } from '@src/modules/company/application/dto/output/create-company.output.dto';

export interface CreateCompanyUseCaseInterface {
  execute(input: CreateCompanyInputDto): Promise<CreateCompanyOutputDto>;
}
