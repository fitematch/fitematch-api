import type { ActivateAccountInputDto } from '@src/modules/auth/application/dto/input/activate-account.input.dto';
import type { ActivateAccountRequestDto } from '@src/modules/auth/adapters/http/dto/request/activate-account.request.dto';

export class ActivateAccountRequestMapper {
  public static toInput(
    body: ActivateAccountRequestDto,
  ): ActivateAccountInputDto {
    return {
      email: body.email,
      code: body.code,
    };
  }
}
