import type { CreateCompanyInputDto } from '@src/modules/company/application/dto/input/create-company.input.dto';
import type { CreateCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/create-company.request.dto';

export class CreateCompanyRequestMapper {
  static toInput(body: CreateCompanyRequestDto): CreateCompanyInputDto {
    return {
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
