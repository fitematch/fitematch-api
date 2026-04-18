import type { ReadCompanyOutputDto } from '@src/modules/company/application/dto/output/read-company.output.dto';
import type { ReadCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/read-company.response.dto';

export class ReadCompanyMapper {
  static toResponse(company: ReadCompanyOutputDto): ReadCompanyResponseDto {
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
