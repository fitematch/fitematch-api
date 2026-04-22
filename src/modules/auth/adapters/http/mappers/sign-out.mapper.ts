import type { SignOutOutputDto } from '@src/modules/auth/application/dto/output/sign-out.output.dto';
import type { SignOutResponseDto } from '@src/modules/auth/adapters/http/dto/response/sign-out.response.dto';

export class SignOutMapper {
  public static toResponse(result: SignOutOutputDto): SignOutResponseDto {
    return {
      message: result.message,
    };
  }
}
