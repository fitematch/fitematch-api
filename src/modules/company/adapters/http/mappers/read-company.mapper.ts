import type { ReadCompanyOutputDto } from '@src/modules/company/application/dto/output/read-company.output.dto';
import type { ReadCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/read-company.response.dto';
import { MaskUtils } from '@src/shared/utils/mask.utils';

export class ReadCompanyMapper {
  static toResponse(company: ReadCompanyOutputDto): ReadCompanyResponseDto {
    const maskUtils = new MaskUtils();

    return {
      id: company.id,
      slug: company.slug,
      tradeName: company.tradeName,
      legalName: company.legalName,
      contacts: {
        ...company.contacts,
        phone: {
          ...company.contacts.phone,
          number: maskUtils.formatPhone(company.contacts.phone.number),
        },
        address: {
          ...company.contacts.address,
          zipCode: maskUtils.formatCEP(company.contacts.address.zipCode),
        },
      },
      documents: {
        ...company.documents,
        cnpj: company.documents.cnpj
          ? maskUtils.formatCNPJ(company.documents.cnpj)
          : undefined,
      },
      media: company.media,
      audit: company.audit,
      approval: company.approval,
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
