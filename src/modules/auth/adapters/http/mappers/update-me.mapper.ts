import type { UpdateMeOutputDto } from '@src/modules/auth/application/dto/output/update-me.output.dto';
import type { UpdateMeResponseDto } from '@src/modules/auth/adapters/http/dto/response/update-me.response.dto';

export class UpdateMeMapper {
  public static toResponse(user: UpdateMeOutputDto): UpdateMeResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      birthday: user.birthday,
      productRole: user.productRole,
      adminRole: user.adminRole,
      permissions: user.permissions,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
