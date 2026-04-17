import type { UpdateUserInputDto } from '@src/modules/user/application/dto/input/update-user.input.dto';
import type { UpdateUserParamsDto } from '@src/modules/user/adapters/http/dto/request/update-user.params.dto';
import type { UpdateUserRequestDto } from '@src/modules/user/adapters/http/dto/request/update-user.request.dto';

export class UpdateUserRequestMapper {
  static toInput(
    params: UpdateUserParamsDto,
    body: UpdateUserRequestDto,
  ): UpdateUserInputDto {
    return {
      id: params.id,
      name: body.name,
      email: body.email,
      password: body.password,
      birthday: body.birthday,
      documents: body.documents
        ? ({
            rg: body.documents.rg
              ? {
                  number: body.documents.rg.number!,
                  issuer: body.documents.rg.issuer!,
                  state: body.documents.rg.state!,
                }
              : undefined,
            cpf: body.documents.cpf
              ? {
                  number: body.documents.cpf.number!,
                }
              : undefined,
            cref: body.documents.cref
              ? {
                  number: body.documents.cref.number!,
                  category: body.documents.cref.category!,
                  isActive: body.documents.cref.isActive!,
                }
              : undefined,
            passport: body.documents.passport
              ? {
                  number: body.documents.passport.number!,
                  country: body.documents.passport.country!,
                  expirationDate: body.documents.passport.expirationDate
                    ? new Date(body.documents.passport.expirationDate)
                    : undefined,
                }
              : undefined,
          } as UpdateUserInputDto['documents'])
        : undefined,
      contacts: body.contacts
        ? {
            phone: body.contacts.phone
              ? {
                  countryCode: body.contacts.phone.countryCode,
                  areaCode: body.contacts.phone.areaCode,
                  number: body.contacts.phone.number,
                  isWhatsapp: body.contacts.phone.isWhatsapp,
                  isTelegram: body.contacts.phone.isTelegram,
                }
              : undefined,
            address: body.contacts.address
              ? {
                  street: body.contacts.address.street,
                  number: body.contacts.address.number,
                  complement: body.contacts.address.complement,
                  neighborhood: body.contacts.address.neighborhood,
                  city: body.contacts.address.city,
                  state: body.contacts.address.state,
                  country: body.contacts.address.country,
                  zipCode: body.contacts.address.zipCode,
                }
              : undefined,
            social: body.contacts.social
              ? {
                  facebook: body.contacts.social.facebook,
                  instagram: body.contacts.social.instagram,
                  x: body.contacts.social.x,
                  linkedin: body.contacts.social.linkedin,
                  youtube: body.contacts.social.youtube,
                  tiktok: body.contacts.social.tiktok,
                }
              : undefined,
          }
        : undefined,
      media: body.media,
      productRole: body.productRole,
      adminRole: body.adminRole,
      status: body.status,
    };
  }
}
