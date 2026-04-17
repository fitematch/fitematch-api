import { LeanUser } from '@src/modules/user/infrastructure/database/types/user-lean.type';
import { ListUserRepositoryOutputDto } from '@src/modules/user/application/dto/output/list-user.repository-output.dto';

export class UserPersistenceMapper {
  static toListOutput(this: void, user: LeanUser): ListUserRepositoryOutputDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split('T')[0]
        : undefined,
      documents: user.documents as ListUserRepositoryOutputDto['documents'],
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
      status: user.status,
      productRole: user.productRole,
      adminRole: user.adminRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
