import type { CreateCompanyInputDto } from '@src/modules/company/application/dto/input/create-company.input.dto';
import type { CreateCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/create-company.request.dto';

export class CreateCompanyRequestMapper {
  static toInput(body: CreateCompanyRequestDto): CreateCompanyInputDto {
    return {
      slug: body.slug,
      tradeName: body.tradeName,
      legalName: body.legalName,
      contacts: {
        email: body.contacts.email,
        website: body.contacts.website,
        phone: {
          country: body.contacts.phone.countryCode,
          number: body.contacts.phone.number,
          isWhatsapp: body.contacts.phone.isWhatsapp,
          isTelegram: body.contacts.phone.isTelegram,
        },
        address: {
          street: body.contacts.address.street,
          number:
            body.contacts.address.number !== undefined
              ? String(body.contacts.address.number)
              : undefined,
          complement: body.contacts.address.complement,
          neighborhood: body.contacts.address.neighborhood,
          city: body.contacts.address.city,
          state: body.contacts.address.state,
          country: body.contacts.address.country,
          zipCode: body.contacts.address.zipCode,
        },
        social: body.contacts.social,
      },
      documents: body.documents,
      media: body.media,
      audit: body.audit,
      approval: body.approval,
      status: body.status,
    };
  }
}
