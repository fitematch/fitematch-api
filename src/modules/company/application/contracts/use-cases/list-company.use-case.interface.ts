import { ListCompanyInputDto } from '@src/modules/company/application/dto/input/list-company.input.dto';
import { ListCompanyOutputDto } from '@src/modules/company/application/dto/output/list-company.output.dto';

export interface ListCompanyUseCaseInterface {
  execute(input: ListCompanyInputDto): Promise<ListCompanyOutputDto[]>;
}
