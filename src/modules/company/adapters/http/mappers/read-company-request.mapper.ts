import type { ReadCompanyInputDto } from '@src/modules/company/application/dto/input/read-company.input.dto';
import type { ReadCompanyParamsDto } from '@src/modules/company/adapters/http/dto/request/read-company.params.dto';

export class ReadCompanyRequestMapper {
  static toInput(params: ReadCompanyParamsDto): ReadCompanyInputDto {
    return {
      id: params.id,
    };
  }
}
