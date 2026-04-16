import { ListUserOutputDto } from '@src/modules/user/application/dto/output/list-user.output.dto';
import { ListUserResponseDto } from '@src/modules/user/adapters/http/dto/response/list-user.response.dto';

export class ListUserMapper {
  static toResponse(user: ListUserOutputDto): ListUserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      document: {
        identityDocumentNumber: user.document?.identityDocumentNumber,
        identityIssuer: user.document?.identityIssuer,
        identityState: user.document?.identityState,
        socialDocumentNumber: user.document?.socialDocumentNumber,
      },
      phone: {
        number: user.phone?.number,
        isWhatsapp: user.phone?.isWhatsapp,
        isTelegram: user.phone?.isTelegram,
      },
      address: {
        street: user.address?.street,
        number: user.address?.number,
        complement: user.address?.complement,
        neighborhood: user.address?.neighborhood,
        city: user.address?.city,
        state: user.address?.state,
        country: user.address?.country,
        zipCode: user.address?.zipCode,
      },
      social: {
        facebook: user.social?.facebook,
        instagram: user.social?.instagram,
        x: user.social?.x,
        youtube: user.social?.youtube,
        tiktok: user.social?.tiktok,
        linkedin: user.social?.linkedin,
      },
      media: {
        resumeUrl: user.media?.resumeUrl,
      },
      productRole: user.productRole,
      adminRole: user.adminRole,
      status: user.status,
    };
  }
}
