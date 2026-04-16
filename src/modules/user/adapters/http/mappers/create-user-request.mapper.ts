import type { CreateUserInputDto } from '@src/modules/user/application/dto/input/create-user.input.dto';
import type { CreateUserRequestDto } from '@src/modules/user/adapters/http/dto/request/create-user.request.dto';

export class CreateUserRequestMapper {
  static toInput(body: CreateUserRequestDto): CreateUserInputDto {
    return {
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
