import type { DeleteCompanyInputDto } from '@src/modules/company/application/dto/input/delete-company.input.dto';
import type { DeleteCompanyParamsDto } from '@src/modules/company/adapters/http/dto/request/delete-company.params.dto';

export class DeleteCompanyRequestMapper {
  static toInput(params: DeleteCompanyParamsDto): DeleteCompanyInputDto {
    return {
      _id: params._id,
    };
  }
}
