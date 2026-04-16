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
        identityDocumentNumber: user.documents?.identityDocumentNumber,
        identityIssuer: user.documents?.identityIssuer,
        identityState: user.documents?.identityState,
        socialDocumentNumber: user.documents?.socialDocumentNumber,
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
      status: user.status ?? UserStatusEnum.PENDING,
    };
  }
}
