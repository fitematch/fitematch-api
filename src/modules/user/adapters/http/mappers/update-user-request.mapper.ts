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
      documents: body.documents,
      phone: body.phone,
      address: body.address,
      social: body.social,
      media: body.media,
      productRole: body.productRole,
      adminRole: body.adminRole,
      status: body.status,
    };
  }
}
