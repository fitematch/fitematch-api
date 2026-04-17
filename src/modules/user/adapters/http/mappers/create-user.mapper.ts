import { CreateUserOutputDto } from '@src/modules/user/application/dto/output/create-user.output.dto';
import { CreateUserResponseDto } from '@src/modules/user/adapters/http/dto/response/create-user.response.dto';
import { UserStatusEnum } from '@src/modules/user/domain/enums/user-status.enum';

export class CreateUserMapper {
  static toResponse(user: CreateUserOutputDto): CreateUserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      documents: {
        rg: user.documents?.rg
          ? {
              number: user.documents.rg.number,
              issuer: user.documents.rg.issuer,
              state: user.documents.rg.state,
            }
          : undefined,
        cpf: user.documents?.cpf
          ? {
              number: user.documents.cpf.number,
            }
          : undefined,
        cref: user.documents?.cref
          ? {
              number: user.documents.cref.number,
              category: user.documents.cref.category,
              isActive: user.documents.cref.isActive,
            }
          : undefined,
        passport: user.documents?.passport
          ? {
              number: user.documents.passport.number,
              country: user.documents.passport.country,
              expirationDate: new Date(
                user.documents.passport.expirationDate,
              ).toISOString(),
            }
          : undefined,
      },
      contacts: {
        phone: user.contacts?.phone
          ? {
              number: user.contacts.phone.number,
              isWhatsapp: user.contacts.phone.isWhatsapp,
              isTelegram: user.contacts.phone.isTelegram,
            }
          : undefined,
        address: user.contacts?.address
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
        social: user.contacts?.social
          ? {
              facebook: user.contacts.social.facebook,
              instagram: user.contacts.social.instagram,
              x: user.contacts.social.x,
              youtube: user.contacts.social.youtube,
              tiktok: user.contacts.social.tiktok,
              linkedin: user.contacts.social.linkedin,
            }
          : undefined,
      },
      media: {
        resumeUrl: user.media?.resumeUrl,
      },
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status ?? UserStatusEnum.PENDING,
    };
  }
}
