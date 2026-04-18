import { ListCompanyInputDto } from '@src/modules/company/application/dto/input/list-company.input.dto';
import { ListCompanyRepositoryOutputDto } from '@src/modules/company/application/dto/output/list-company.repository-output.dto';

export interface ListCompanyRepositoryInterface {
  list(input: ListCompanyInputDto): Promise<ListCompanyRepositoryOutputDto[]>;
}
