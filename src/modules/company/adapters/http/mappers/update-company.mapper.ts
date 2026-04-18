import type { UpdateCompanyOutputDto } from '@src/modules/company/application/dto/output/update-company.output.dto';
import type { UpdateCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/update-company.response.dto';

export class UpdateCompanyMapper {
  static toResponse(company: UpdateCompanyOutputDto): UpdateCompanyResponseDto {
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
