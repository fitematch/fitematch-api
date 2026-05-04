import { ReadMyCompanyInputDto } from '@src/modules/company/application/dto/input/read-my-company.input.dto';
import { ReadMyCompanyOutputDto } from '@src/modules/company/application/dto/output/read-my-company.output.dto';

export interface ReadMyCompanyRepositoryInterface {
  read(input: ReadMyCompanyInputDto): Promise<ReadMyCompanyOutputDto | null>;
}
