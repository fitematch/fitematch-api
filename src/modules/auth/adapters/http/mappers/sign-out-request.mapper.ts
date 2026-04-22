import type { SignOutInputDto } from '@src/modules/auth/application/dto/input/sign-out.input.dto';
import type { SignOutRequestDto } from '@src/modules/auth/adapters/http/dto/request/sign-out.request.dto';

export class SignOutRequestMapper {
  public static toInput(body: SignOutRequestDto): SignOutInputDto {
    return {
      refreshToken: body.refreshToken,
    };
  }
}
