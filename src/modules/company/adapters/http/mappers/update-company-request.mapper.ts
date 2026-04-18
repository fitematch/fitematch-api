import type { UpdateCompanyInputDto } from '@src/modules/company/application/dto/input/update-company.input.dto';
import type { UpdateCompanyParamsDto } from '@src/modules/company/adapters/http/dto/request/update-company.params.dto';
import type { UpdateCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/update-company.request.dto';

export class UpdateCompanyRequestMapper {
  static toInput(
    params: UpdateCompanyParamsDto,
    body: UpdateCompanyRequestDto,
  ): UpdateCompanyInputDto {
    return {
      id: params.id,
      slug: body.slug,
      tradeName: body.tradeName,
      legalName: body.legalName,
      contacts: body.contacts,
      documents: body.documents,
      media: body.media,
      audit: body.audit,
      approval: body.approval,
      status: body.status,
    };
  }
}
