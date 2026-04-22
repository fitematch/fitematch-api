import type { GetMeOutputDto } from '@src/modules/auth/application/dto/output/get-me.output.dto';
import type { GetMeResponseDto } from '@src/modules/auth/adapters/http/dto/response/get-me.response.dto';

export class GetMeMapper {
  public static toResponse(user: GetMeOutputDto): GetMeResponseDto {
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
