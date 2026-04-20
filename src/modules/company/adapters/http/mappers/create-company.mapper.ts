import type { CreateCompanyOutputDto } from '@src/modules/company/application/dto/output/create-company.output.dto';
import type { CreateCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/create-company.response.dto';
import { MaskUtils } from '@src/shared/utils/mask.utils';

export class CreateCompanyMapper {
  static toResponse(company: CreateCompanyOutputDto): CreateCompanyResponseDto {
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
