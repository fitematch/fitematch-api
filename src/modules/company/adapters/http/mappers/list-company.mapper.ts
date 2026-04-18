import { ListCompanyOutputDto } from '@src/modules/company/application/dto/output/list-company.output.dto';
import { ListCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/list-company.response.dto';

export class ListCompanyMapper {
  static toResponse(company: ListCompanyOutputDto): ListCompanyResponseDto {
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
