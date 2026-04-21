import type { SignUpInputDto } from '@src/modules/auth/application/dto/input/sign-up.input.dto';
import type { SignUpRequestDto } from '@src/modules/auth/adapters/http/dto/request/sign-up.request.dto';

export class SignUpRequestMapper {
  public static toInput(body: SignUpRequestDto): SignUpInputDto {
    return {
      name: body.name,
      email: body.email,
      password: body.password,
      birthday: body.birthday,
      productRole: body.productRole,
    };
  }
}
