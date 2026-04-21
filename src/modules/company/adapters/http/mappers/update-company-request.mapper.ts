import type { UpdateCompanyInputDto } from '@src/modules/company/application/dto/input/update-company.input.dto';
import type { UpdateCompanyParamsDto } from '@src/modules/company/adapters/http/dto/request/update-company.params.dto';
import type { UpdateCompanyRequestDto } from '@src/modules/company/adapters/http/dto/request/update-company.request.dto';

export class UpdateCompanyRequestMapper {
  static toInput(
    params: UpdateCompanyParamsDto,
    body: UpdateCompanyRequestDto,
  ): UpdateCompanyInputDto {
    return {
      _id: params._id,
      slug: body.slug,
      tradeName: body.tradeName,
      legalName: body.legalName,
      contacts: body.contacts
        ? {
            email: body.contacts.email,
            website: body.contacts.website,
            phone: body.contacts.phone
              ? {
                  country: body.contacts.phone.country,
                  number: body.contacts.phone.number,
                  isWhatsapp: body.contacts.phone.isWhatsapp,
                  isTelegram: body.contacts.phone.isTelegram,
                }
              : undefined,
            address: body.contacts.address
              ? {
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
                }
              : undefined,
            social: body.contacts.social,
          }
        : undefined,
      documents: body.documents,
      media: body.media,
      audit: body.audit,
      approval: body.approval,
      status: body.status,
    };
  }
}
