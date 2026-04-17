import type { UpdateUserOutputDto } from '@src/modules/user/application/dto/output/update-user.output.dto';
import type { UpdateUserResponseDto } from '@src/modules/user/adapters/http/dto/response/update-user.response.dto';

export class UpdateUserMapper {
  static toResponse(user: UpdateUserOutputDto): UpdateUserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      documents: user.documents
        ? ({
            rg: user.documents.rg
              ? {
                  number: user.documents.rg.number,
                  issuer: user.documents.rg.issuer,
                  state: user.documents.rg.state,
                }
              : undefined,
            cpf: user.documents.cpf
              ? {
                  number: user.documents.cpf.number,
                }
              : undefined,
            cref: user.documents.cref
              ? {
                  number: user.documents.cref.number,
                  category: user.documents.cref.category,
                  isActive: user.documents.cref.isActive,
                }
              : undefined,
            passport: user.documents.passport
              ? {
                  number: user.documents.passport.number,
                  country: user.documents.passport.country,
                  expirationDate: user.documents.passport.expirationDate
                    ? new Date(user.documents.passport.expirationDate)
                        .toISOString()
                        .split('T')[0]
                    : undefined,
                }
              : undefined,
          } as UpdateUserResponseDto['documents'])
        : undefined,
      contacts: user.contacts
        ? {
            phone: user.contacts.phone
              ? {
                  countryCode: user.contacts.phone.countryCode,
                  areaCode: user.contacts.phone.areaCode,
                  number: user.contacts.phone.number,
                  isWhatsapp: user.contacts.phone.isWhatsapp,
                  isTelegram: user.contacts.phone.isTelegram,
                }
              : undefined,
            address: user.contacts.address
              ? {
                  street: user.contacts.address.street,
                  number: user.contacts.address.number,
                  complement: user.contacts.address.complement,
                  neighborhood: user.contacts.address.neighborhood,
                  city: user.contacts.address.city,
                  state: user.contacts.address.state,
                  country: user.contacts.address.country,
                  zipCode: user.contacts.address.zipCode,
                }
              : undefined,
            social: user.contacts.social
              ? {
                  facebook: user.contacts.social.facebook,
                  instagram: user.contacts.social.instagram,
                  x: user.contacts.social.x,
                  youtube: user.contacts.social.youtube,
                  tiktok: user.contacts.social.tiktok,
                  linkedin: user.contacts.social.linkedin,
                }
              : undefined,
          }
        : undefined,
      media: user.media
        ? {
            resumeUrl: user.media.resumeUrl,
          }
        : undefined,
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
