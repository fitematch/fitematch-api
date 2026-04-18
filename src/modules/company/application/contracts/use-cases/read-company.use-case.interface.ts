import type { ReadCompanyInputDto } from '@src/modules/company/application/dto/input/read-company.input.dto';
import type { ReadCompanyOutputDto } from '@src/modules/company/application/dto/output/read-company.output.dto';

export interface ReadCompanyUseCaseInterface {
  execute(input: ReadCompanyInputDto): Promise<ReadCompanyOutputDto | null>;
}
