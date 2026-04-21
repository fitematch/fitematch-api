import { ListCompanyOutputDto } from '@src/modules/company/application/dto/output/list-company.output.dto';
import { ListCompanyResponseDto } from '@src/modules/company/adapters/http/dto/response/list-company.response.dto';
import { MaskUtils } from '@src/shared/utils/mask.utils';

export class ListCompanyMapper {
  static toResponse(company: ListCompanyOutputDto): ListCompanyResponseDto {
    const maskUtils = new MaskUtils();

    return {
      _id: company._id,
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
