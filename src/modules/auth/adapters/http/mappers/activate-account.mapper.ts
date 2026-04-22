import type { ActivateAccountOutputDto } from '@src/modules/auth/application/dto/output/activate-account.output.dto';
import type { ActivateAccountResponseDto } from '@src/modules/auth/adapters/http/dto/response/activate-account.response.dto';

export class ActivateAccountMapper {
  public static toResponse(
    result: ActivateAccountOutputDto,
  ): ActivateAccountResponseDto {
    return {
      message: result.message,
    };
  }
}
