import { ListUserOutputDto } from '@src/modules/user/application/dto/output/list-user.output.dto';
import { ListUserResponseDto } from '@src/modules/user/adapters/http/dto/response/list-user.response.dto';

export class ListUserMapper {
  static toResponse(user: ListUserOutputDto): ListUserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split('T')[0]
        : undefined,
      documents: user.documents
        ? {
            identityDocumentNumber: user.documents.identityDocumentNumber,
            identityIssuer: user.documents.identityIssuer,
            identityState: user.documents.identityState,
            socialDocumentNumber: user.documents.socialDocumentNumber,
          }
        : undefined,
      phone: user.phone
        ? {
            number: user.phone.number,
            isWhatsapp: user.phone.isWhatsapp,
            isTelegram: user.phone.isTelegram,
          }
        : undefined,
      address: user.address
        ? {
            street: user.address.street,
            number: user.address.number,
            complement: user.address.complement,
            neighborhood: user.address.neighborhood,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            zipCode: user.address.zipCode,
          }
        : undefined,
      social: user.social
        ? {
            facebook: user.social.facebook,
            instagram: user.social.instagram,
            x: user.social.x,
            youtube: user.social.youtube,
            tiktok: user.social.tiktok,
            linkedin: user.social.linkedin,
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
    };
  }
}
