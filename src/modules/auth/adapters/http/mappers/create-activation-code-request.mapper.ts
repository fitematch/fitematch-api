import type { CreateActivationCodeInputDto } from '@src/modules/auth/application/dto/input/create-activation-code.input.dto';
import type { CreateActivationCodeRequestDto } from '@src/modules/auth/adapters/http/dto/request/create-activation-code.request.dto';

export class CreateActivationCodeRequestMapper {
  public static toInput(
    body: CreateActivationCodeRequestDto,
  ): CreateActivationCodeInputDto {
    return {
      email: body.email,
    };
  }
}
