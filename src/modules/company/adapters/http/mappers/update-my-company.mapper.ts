import type { UpdateMyCompanyOutputDto } from '@src/modules/company/application/dto/output/update-my-company.output.dto';
import type { UpdateMyCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/update-my-company.response.dto';
import { ReadMyCompanyMapper } from '@src/modules/company/adapters/http/mappers/read-my-company.mapper';

export class UpdateMyCompanyMapper {
  static toResponse(
    company: UpdateMyCompanyOutputDto,
  ): UpdateMyCompanyResponseDto {
    return ReadMyCompanyMapper.toResponse(company);
  }
}
