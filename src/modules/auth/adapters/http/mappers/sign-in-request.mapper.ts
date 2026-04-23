import type { SignInInputDto } from '@src/modules/auth/application/dto/input/sign-in.input.dto';
import type { SignInRequestDto } from '@src/modules/auth/adapters/http/dto/request/sign-in.request.dto';

export class SignInRequestMapper {
  public static toInput(
    body: SignInRequestDto,
    userAgent?: string,
    ipAddress?: string,
  ): SignInInputDto {
    return {
      email: body.email,
      password: body.password,
      userAgent,
      ipAddress,
    };
  }
}
