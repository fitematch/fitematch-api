import type { CreateActivationCodeOutputDto } from '@src/modules/auth/application/dto/output/create-activation-code.output.dto';
import type { CreateActivationCodeResponseDto } from '@src/modules/auth/adapters/http/dto/response/create-activation-code.response.dto';

export class CreateActivationCodeMapper {
  public static toResponse(
    result: CreateActivationCodeOutputDto,
  ): CreateActivationCodeResponseDto {
    return {
      message: result.message,
    };
  }
}
