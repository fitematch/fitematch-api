import type { CreateMyCompanyOutputDto } from '@src/modules/company/application/dto/output/create-my-company.output.dto';
import type { CreateMyCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/create-my-company.response.dto';
import { ReadMyCompanyMapper } from '@src/modules/company/adapters/http/mappers/read-my-company.mapper';

export class CreateMyCompanyMapper {
  static toResponse(
    company: CreateMyCompanyOutputDto,
  ): CreateMyCompanyResponseDto {
    return ReadMyCompanyMapper.toResponse(company);
  }
}
