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
      documents: user.documents,
      contacts: user.contacts,
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
