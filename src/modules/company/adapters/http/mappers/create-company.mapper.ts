import type { CreateCompanyOutputDto } from '@src/modules/company/application/dto/output/create-company.output.dto';
import type { CreateCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/create-company.response.dto';

export class CreateCompanyMapper {
  static toResponse(company: CreateCompanyOutputDto): CreateCompanyResponseDto {
    return {
      id: company.id,
      slug: company.slug,
      tradeName: company.tradeName,
      legalName: company.legalName,
      contacts: company.contacts,
      documents: company.documents,
      media: company.media,
      audit: company.audit,
      approval: company.approval,
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
