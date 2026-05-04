import { ReadMyCompanyInputDto } from '@src/modules/company/application/dto/input/read-my-company.input.dto';
import { ReadMyCompanyOutputDto } from '@src/modules/company/application/dto/output/read-my-company.output.dto';

export interface ReadMyCompanyUseCaseInterface {
  execute(input: ReadMyCompanyInputDto): Promise<ReadMyCompanyOutputDto | null>;
}
